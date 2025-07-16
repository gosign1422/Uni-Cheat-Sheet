// Initialize Supabase client with debugging
const supabaseUrl = 'https://kajvhoznuxmilwezohgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthanZob3pudXhtaWx3ZXpvaGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDMwNjUsImV4cCI6MjA1OTIxOTA2NX0.IoPJrHBRF3zlDdWP0FdKEgJbUtWRP6xm9_q-Pd6xBNs';

// Enable console logging for debugging
const DEBUG = true;
function logDebug(...args) {
  if (DEBUG) {
    console.log('[Chat Debug]', ...args);
  }
}

// Chat room topics with icons
const chatRooms = {
  'general': { name: 'General', icon: '💬' },
  'aem': { name: 'AEM', icon: '📐' },
  'physics': { name: 'Physics', icon: '⚛️' },
  'programming': { name: 'Coding', icon: '💻' },
  'coa': { name: 'COA', icon: '🔧' },
  'de': { name: 'DE', icon: '⚡' }
};

// File type icons
const fileTypeIcons = {
  'image': '🖼️',
  'video': '🎥',
  'audio': '🎵',
  'pdf': '📄',
  'doc': '📝',
  'docx': '📝',
  'xls': '📊',
  'xlsx': '📊',
  'ppt': '📑',
  'pptx': '📑',
  'zip': '📦',
  'rar': '📦',
  'default': '📎'
};

// Wait for the Supabase script to load
window.addEventListener('load', async () => {
  logDebug('Chat widget initializing...');
  
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  
  logDebug('Supabase client created');

  // Add a simple test query to verify database connection
  const { data: testData, error: testError } = await supabaseClient
    .from('messages')
    .select('count(*)')
    .limit(1);
    
  if (testError) {
    console.error('Database connection test failed:', testError);
  } else {
    logDebug('Database connection successful, message count:', testData);
  }

  // Verify storage bucket exists
  try {
    const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
    console.log('Available buckets:', buckets);
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      throw bucketsError;
    }

    const chatFilesBucket = buckets.find(b => b.name === 'chat-files');
    if (!chatFilesBucket) {
      console.error('chat-files bucket not found. Available buckets:', buckets);
      throw new Error('Storage bucket not configured');
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
  }

  // Create chat widget HTML
  const chatWidgetHTML = `
    <div id="chatWidget" class="chat-widget">
      <button id="chatToggleButton" class="chat-toggle-button">
        Chat
      </button>
      <div id="chatContainer" class="chat-widget-container" style="display: none;">
        <div class="chat-widget-header">
          <h3>Student Chat Room</h3>
          <button id="chatCloseButton" class="close-button">×</button>
        </div>
        <div id="usernameContainer" class="username-container">
          <h4>Enter your username to start chatting</h4>
          <form id="usernameForm">
            <input type="text" id="usernameInput" placeholder="Enter username" required>
            <button type="submit">Start Chatting</button>
          </form>
        </div>
        <div id="chatRoom" style="display: none;">
          <div class="room-selector">
            <select id="roomSelect">
              ${Object.entries(chatRooms).map(([key, value]) => 
                `<option value="${key}">${value.icon} ${value.name}</option>`
              ).join('')}
            </select>
          </div>
          <div id="messagesContainer" class="messages-container"></div>
          <button id="scrollToBottom" class="scroll-to-bottom" title="Scroll to bottom">⬇️</button>
          <form id="messageForm" class="message-form">
            <div class="input-group">
              <input type="text" id="messageInput" placeholder="Type your message..." required>
              <div class="file-upload-container">
                <label for="fileUpload" class="file-upload-button">📎</label>
                <input type="file" id="fileUpload" class="file-upload-input" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar">
              </div>
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add chat widget to page
  document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);

  // Get DOM elements
  const chatWidget = document.getElementById('chatWidget');
  const chatToggleButton = document.getElementById('chatToggleButton');
  const chatContainer = document.getElementById('chatContainer');
  const chatCloseButton = document.getElementById('chatCloseButton');
  const usernameContainer = document.getElementById('usernameContainer');
  const usernameForm = document.getElementById('usernameForm');
  const usernameInput = document.getElementById('usernameInput');
  const chatRoom = document.getElementById('chatRoom');
  const roomSelect = document.getElementById('roomSelect');
  const messagesContainer = document.getElementById('messagesContainer');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const fileUpload = document.getElementById('fileUpload');
  const scrollToBottomButton = document.getElementById('scrollToBottom');

  let username = '';
  let currentRoom = 'general';
  let currentSubscription = null;
  let messageCache = new Map(); // Cache for messages by room
  let selectedFile = null;
  let sentMessageIds = new Set(); // Track IDs of messages we've sent to avoid duplicates

  // Handle mobile responsiveness
  function handleMobileChat() {
    if (window.innerWidth <= 768) {
      document.body.classList.add('chat-open');
    }
  }

  function handleMobileChatClose() {
    document.body.classList.remove('chat-open');
  }

  // Event listeners
  chatToggleButton.addEventListener('click', () => {
    chatContainer.style.display = 'flex';
    chatToggleButton.style.display = 'none';
    handleMobileChat();
  });

  chatCloseButton.addEventListener('click', () => {
    chatContainer.style.display = 'none';
    chatToggleButton.style.display = 'block';
    handleMobileChatClose();
  });

  // Add click outside handler
  document.addEventListener('click', (e) => {
    // Check if the click is outside the chat container and toggle button
    if (!chatContainer.contains(e.target) && !chatToggleButton.contains(e.target)) {
      // Only minimize if the chat is currently open
      if (chatContainer.style.display === 'flex') {
        chatContainer.style.display = 'none';
        chatToggleButton.style.display = 'block';
        handleMobileChatClose();
      }
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (chatContainer.style.display === 'flex') {
      handleMobileChat();
    }
  });

  usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = usernameInput.value.trim();
    if (username) {
      usernameContainer.style.display = 'none';
      chatRoom.style.display = 'block';
      subscribeToRoom(currentRoom);
      fetchMessages(currentRoom);
    }
  });

  roomSelect.addEventListener('change', (e) => {
    const newRoom = e.target.value;
    if (currentRoom !== newRoom) {
      currentRoom = newRoom;
      messagesContainer.innerHTML = '';
      
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }

      if (messageCache.has(newRoom)) {
        const cachedMessages = messageCache.get(newRoom);
        cachedMessages.forEach(addMessageToDOM);
        scrollToBottom();
      } else {
        fetchMessages(newRoom);
      }

      subscribeToRoom(newRoom);
    }
  });

  fileUpload.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      messageInput.value = `Attaching: ${selectedFile.name}`;
    }
  });

  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    
    if ((!content && !selectedFile) || !username) return;

    logDebug('Sending message:', content);
    
    // Force UI update immediately
    messageInput.value = '';

    // Create message element immediately and display it
    const tempId = 'msg_' + Date.now();
    const time = new Date();
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Prepare file data if any
    let fileInfo = null;
    let attachmentHtml = '';
    
    if (selectedFile) {
      const fileType = selectedFile.type.split('/')[0];
      const fileIcon = getFileTypeIcon(fileType);
      const fileSize = formatFileSize(selectedFile.size);
      
      fileInfo = {
        name: selectedFile.name,
        type: fileType,
        size: selectedFile.size
      };
      
      attachmentHtml = `
        <div class="message-attachment">
          <span class="file-icon">${fileIcon}</span>
          ${selectedFile.name}
          <span style="color: #888; font-size: 12px;">(${fileSize})</span>
          <span class="upload-status">(Uploading...)</span>
        </div>
      `;
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message own-message`;
    messageElement.id = tempId;
    
    messageElement.innerHTML = `
      <div class="message-username">${username}</div>
      ${content ? `<div class="message-content">${content}</div>` : ''}
      ${attachmentHtml}
      <div class="message-time">${formattedTime}</div>
    `;
    
    // Add to DOM immediately
    messagesContainer.appendChild(messageElement);
    
    // Force browser to render the message immediately
    messageElement.offsetHeight;
    
    scrollToBottom(true);
    
    try {
      let fileUrl = null;
      let fileName = null;
      let fileType = null;
      let fileSize = null;

      // Upload file if selected
      if (selectedFile) {
        console.log('Starting file upload:', selectedFile.name);
        
        // Check file size (50MB limit)
        if (selectedFile.size > 50 * 1024 * 1024) {
          alert('File size must be less than 50MB');
          // Remove the message element
          messageElement.remove();
          return;
        }

        // Generate unique filename
        const fileExt = selectedFile.name.split('.').pop();
        const uniqueFileName = `${currentRoom}/${Math.random().toString(36).substring(2)}.${fileExt}`;

        console.log('Uploading to path:', uniqueFileName);

        try {
          // Upload file
          const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('chat-files')
            .upload(uniqueFileName, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });
  
          if (uploadError) {
            console.error('Upload error:', uploadError);
            
            // Update message with error
            if (messageElement) {
              const statusEl = messageElement.querySelector('.upload-status');
              if (statusEl) statusEl.innerHTML = '(Upload failed)';
            }
            
            throw uploadError;
          }
  
          // Get public URL
          const { data: { publicUrl } } = supabaseClient.storage
            .from('chat-files')
            .getPublicUrl(uniqueFileName);
  
          fileUrl = publicUrl;
          fileName = selectedFile.name;
          fileType = selectedFile.type.split('/')[0]; // e.g., "image" from "image/png"
          fileSize = selectedFile.size;
          
          // Update message with success
          if (messageElement) {
            const statusEl = messageElement.querySelector('.upload-status');
            if (statusEl) statusEl.remove();
            
            // Add preview if it's an image
            if (fileType === 'image') {
              const previewDiv = document.createElement('div');
              previewDiv.className = 'file-preview';
              previewDiv.innerHTML = `<img src="${fileUrl}" alt="${fileName}" onclick="window.open('${fileUrl}', '_blank')">`;
              messageElement.appendChild(previewDiv);
            }
          }
        } catch (uploadErr) {
          alert('Failed to upload file: ' + uploadErr.message);
          // But continue with sending the message text
        }
      }

      console.log('Sending message to room:', currentRoom);
      
      // Create message object for database
      const newMessage = {
        username: username,
        content: content || '',
        room: currentRoom,
        file_url: fileUrl,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        created_at: time.toISOString()
      };
      
      // Insert message into database
      const { data, error } = await supabaseClient.from('messages').insert([newMessage]).select();

      if (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message: ' + error.message);
        return;
      }
      
      console.log('Message sent successfully:', data);
      
      // Track the message ID to avoid duplicates from subscription
      if (data && data.length > 0 && data[0].id) {
        sentMessageIds.add(data[0].id);
        
        // Update element ID to match database ID
        if (messageElement) {
          messageElement.id = 'msg_' + data[0].id;
        }
      }
      
      // Add message to cache
      if (messageCache.has(currentRoom)) {
        const messageToCache = (data && data.length > 0) ? data[0] : newMessage;
        messageCache.get(currentRoom).push(messageToCache);
      }

      // Reset file upload
      selectedFile = null;
      fileUpload.value = null;
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error: ' + error.message);
    }
  });

  // Fetch existing messages for a room
  async function fetchMessages(room) {
    try {
      console.log('Fetching messages for room:', room);
      
      const { data, error } = await supabaseClient
        .from('messages')
        .select('*')
        .eq('room', room)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        alert('Error fetching messages: ' + error.message);
        return;
      }

      console.log('Fetched messages:', data);
      
      // Clear existing messages
      messagesContainer.innerHTML = '';
      
      // Cache and display messages
      messageCache.set(room, data || []);
      
      if (data) {
        data.forEach(addMessageToDOM);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Unexpected error fetching messages:', error);
      alert('Failed to load messages: ' + error.message);
    }
  }

  // Subscribe to new messages in a room
  function subscribeToRoom(room) {
    console.log('Subscribing to room:', room);
    
    if (currentSubscription) {
      currentSubscription.unsubscribe();
    }
    
    currentSubscription = supabaseClient
      .channel(`room:${room}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room=eq.${room}`
      }, (payload) => {
        console.log('New message received:', payload);
        
        const message = payload.new;
        
        // Skip if we already displayed this message (either our own or a duplicate)
        if (message.username === username || sentMessageIds.has(message.id)) {
          console.log('Skipping message we already displayed:', message.id);
          return;
        }
        
        // Add message ID to our tracking set
        if (message.id) {
          sentMessageIds.add(message.id);
        }
        
        // Add to cache
        if (messageCache.has(room)) {
          messageCache.get(room).push(message);
        }
        
        // Add to DOM
        addMessageToDOM(message);
        
        // Alert user of new message if chat is minimized
        if (chatContainer.style.display === 'none') {
          chatToggleButton.classList.add('has-notification');
        }
        
        // Scroll to bottom if already near bottom
        const isNearBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100;
        if (isNearBottom) {
          scrollToBottom();
        } else {
          scrollToBottomButton.classList.add('show');
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
  }

  // Get file type icon
  function getFileTypeIcon(fileType) {
    if (!fileType) return fileTypeIcons.default;
    
    // Handle both full MIME types and shortened types
    if (typeof fileType === 'string') {
      // Full MIME type (e.g., "image/jpeg")
      if (fileType.includes('/')) {
        const [type, extension] = fileType.split('/');
        
        if (type === 'image') return fileTypeIcons.image;
        if (type === 'video') return fileTypeIcons.video;
        if (type === 'audio') return fileTypeIcons.audio;
        if (extension === 'pdf') return fileTypeIcons.pdf;
        if (['msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'doc', 'docx'].includes(extension)) return fileTypeIcons.doc;
        if (['vnd.ms-excel', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xls', 'xlsx'].includes(extension)) return fileTypeIcons.xls;
        if (['vnd.ms-powerpoint', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'ppt', 'pptx'].includes(extension)) return fileTypeIcons.ppt;
        if (['zip', 'rar', 'x-zip-compressed', 'x-rar-compressed'].includes(extension)) return fileTypeIcons.zip;
      } 
      // Short type (e.g., "image")
      else {
        if (fileType === 'image') return fileTypeIcons.image;
        if (fileType === 'video') return fileTypeIcons.video;
        if (fileType === 'audio') return fileTypeIcons.audio;
        if (fileType === 'pdf') return fileTypeIcons.pdf;
        if (['doc', 'docx'].includes(fileType)) return fileTypeIcons.doc;
        if (['xls', 'xlsx'].includes(fileType)) return fileTypeIcons.xls;
        if (['ppt', 'pptx'].includes(fileType)) return fileTypeIcons.ppt;
        if (['zip', 'rar'].includes(fileType)) return fileTypeIcons.zip;
      }
    }
    
    return fileTypeIcons.default;
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Add message to DOM
  function addMessageToDOM(message) {
    logDebug('Adding message to DOM:', message);
    
    // Create a unique ID for the message element
    const messageId = message.id ? `msg_${message.id}` : `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if this message is already in the DOM
    const existingMessage = document.getElementById(messageId);
    if (existingMessage) {
      logDebug('Message already exists in DOM, skipping:', messageId);
      return;
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.username === username ? 'own-message' : ''}`;
    messageElement.id = messageId;
    
    // Force message rendering with a small delay to ensure DOM updates
    setTimeout(() => {
      const time = new Date(message.created_at);
      const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let attachmentHtml = '';
      if (message.file_url) {
        // Determine file type
        let fileType = message.file_type;
        if (typeof fileType === 'string' && !fileType.includes('/')) {
          // Convert short file type to full MIME type for previews
          switch(fileType) {
            case 'image': fileType = 'image/jpeg'; break;
            case 'video': fileType = 'video/mp4'; break;
            case 'audio': fileType = 'audio/mp3'; break;
            default: fileType = 'application/octet-stream';
          }
        }
        
        const fileIcon = getFileTypeIcon(fileType);
        const fileSize = message.file_size ? formatFileSize(message.file_size) : '';
        
        attachmentHtml = `
          <div class="message-attachment">
            <a href="${message.file_url}" target="_blank">
              <span class="file-icon">${fileIcon}</span>
              ${message.file_name || 'Attachment'}
              ${fileSize ? `<span style="color: #888; font-size: 12px;">(${fileSize})</span>` : ''}
            </a>
          </div>
        `;

        // Add preview for images and videos
        if (fileType && fileType.startsWith('image/')) {
          attachmentHtml += `<div class="file-preview"><img src="${message.file_url}" alt="${message.file_name || 'Image'}" onclick="window.open('${message.file_url}', '_blank')"></div>`;
        } else if (fileType && fileType.startsWith('video/')) {
          attachmentHtml += `<div class="file-preview"><video controls><source src="${message.file_url}" type="${fileType}"></video></div>`;
        } else if (fileType && fileType.startsWith('audio/')) {
          attachmentHtml += `<div class="file-preview"><audio controls><source src="${message.file_url}" type="${fileType}"></audio></div>`;
        }
      }
      
      messageElement.innerHTML = `
        <div class="message-username">${message.username}</div>
        ${message.content ? `<div class="message-content">${message.content}</div>` : ''}
        ${attachmentHtml}
        <div class="message-time">${formattedTime}</div>
      `;
      
      messagesContainer.appendChild(messageElement);
      
      // Force layout recalculation
      messageElement.offsetHeight;
      
      // Make sure the scrollToBottom button appears if we're not at the bottom
      const isNearBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 100;
      scrollToBottomButton.classList.toggle('visible', !isNearBottom);
      
      logDebug('Message added to DOM:', messageId);
    }, 10);
  }

  // Add scroll event listener to messages container
  messagesContainer.addEventListener('scroll', () => {
    const isNearBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 100;
    scrollToBottomButton.classList.toggle('visible', !isNearBottom);
  });

  // Add click event listener to scroll-to-bottom button
  scrollToBottomButton.addEventListener('click', () => {
    scrollToBottom(true);
  });

  // Modified scrollToBottom function with forced layout recalculation
  function scrollToBottom(smooth = false) {
    try {
      // Force a layout recalculation before scrolling
      messagesContainer.offsetHeight;
      
      if (smooth) {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      
      logDebug('Scrolled to bottom');
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  // Add event listener to scroll to bottom when page is refreshed or loaded
  window.addEventListener('pageshow', function() {
    setTimeout(() => {
      if (messagesContainer) {
        scrollToBottom(false);
        logDebug('Scrolled to bottom on page load');
      }
    }, 200);
  });
}); 