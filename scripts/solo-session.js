class PomodoroTimer {
    constructor() {
        // Load saved settings from localStorage
        const savedSettings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {};
        
        this.workTime = savedSettings.workTime || 25;
        this.breakTime = savedSettings.breakTime || 5;
        this.timeLeft = this.workTime * 60;
        this.isRunning = false;
        this.isWorkPhase = true;
        this.pomodoroCount = savedSettings.pomodoroCount || 0;
        this.totalStudyTime = savedSettings.totalStudyTime || 0;
        this.timer = null;
        this.tasks = [];
        this.loadTasks();
        this.warningPlayed = false;

        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateSettings();
        this.updateTasksList();
    }

    initializeElements() {
        // Timer display elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        
        // Buttons
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        
        // Settings inputs
        this.workTimeInput = document.getElementById('workTime');
        this.breakTimeInput = document.getElementById('breakTime');
        
        // Stats elements
        this.phaseLabel = document.getElementById('phase-label');
        this.pomodoroCountDisplay = document.getElementById('pomodoro-count');
        this.totalTimeDisplay = document.getElementById('total-time');
        
        // Audio
        this.audio = document.getElementById('timer-end');

        // Add task elements to existing initialization
        this.taskInput = document.getElementById('task-input');
        this.tasksList = document.getElementById('tasks');
        this.addTaskButton = document.getElementById('add-task');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
        
        this.workTimeInput.addEventListener('change', () => {
            if (!this.isRunning) {
                this.workTime = parseInt(this.workTimeInput.value);
                if (this.isWorkPhase) this.timeLeft = this.workTime * 60;
                this.updateDisplay();
                this.saveSettings();
            }
        });
        
        this.breakTimeInput.addEventListener('change', () => {
            if (!this.isRunning) {
                this.breakTime = parseInt(this.breakTimeInput.value);
                if (!this.isWorkPhase) this.timeLeft = this.breakTime * 60;
                this.updateDisplay();
                this.saveSettings();
            }
        });

        // Add task event listeners to existing setup
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Add this to your existing setupEventListeners method
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const mode = btn.dataset.mode;
                switch(mode) {
                    case 'pomodoro':
                        this.workTime = 25;
                        break;
                    case 'shortbreak':
                        this.workTime = 5;
                        break;
                    case 'longbreak':
                        this.workTime = 15;
                        break;
                }
                
                this.reset();
                this.updateSettings();
                this.saveSettings();
            });
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
            this.warningPlayed = false;
            
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft === 10 && !this.warningPlayed) {
                    this.audio.play();
                    this.warningPlayed = true;
                }
                
                if (this.timeLeft === 0) {
                    this.handlePhaseComplete();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startButton.disabled = false;
            this.pauseButton.disabled = true;
            clearInterval(this.timer);
        }
    }

    reset() {
        this.pause();
        this.isWorkPhase = true;
        this.timeLeft = this.workTime * 60;
        this.updateDisplay();
        this.phaseLabel.textContent = 'Work';
        this.warningPlayed = false;
    }

    handlePhaseComplete() {
        this.audio.play();
        this.pause(); // Stop the timer
        
        if (this.isWorkPhase) {
            this.pomodoroCount++;
            this.totalStudyTime += this.workTime;
            this.pomodoroCountDisplay.textContent = this.pomodoroCount;
            this.totalTimeDisplay.textContent = this.totalStudyTime;
            
            this.phaseLabel.textContent = 'Great Job! Take a Break 🎉';
            this.timeLeft = this.breakTime * 60;
            this.isWorkPhase = false;
            this.updateDisplay();
            
            // Switch active state to break button
            document.querySelector('[data-mode="pomodoro"]').classList.remove('active');
            document.querySelector('[data-mode="shortbreak"]').classList.add('active');
            
            this.startButton.disabled = true;
            setTimeout(() => {
                this.startButton.disabled = false;
                this.phaseLabel.textContent = 'Break';
            }, 3000);
        } else {
            this.isWorkPhase = true;
            this.timeLeft = this.workTime * 60;
            this.phaseLabel.textContent = 'Work';
            
            // Switch active state back to pomodoro button
            document.querySelector('[data-mode="shortbreak"]').classList.remove('active');
            document.querySelector('[data-mode="pomodoro"]').classList.add('active');
        }
        
        this.updateDisplay();
        this.updateSettings();
        this.saveSettings();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            this.tasks.unshift(task);
            this.taskInput.value = '';
            this.updateTasksList();
            this.saveTasks();
        }
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.updateTasksList();
            this.saveTasks();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.updateTasksList();
        this.saveTasks();
    }

    updateTasksList() {
        this.tasksList.innerHTML = this.tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <span>${task.text}</span>
                <div class="task-actions">
                    <button onclick="pomodoroTimer.toggleTaskComplete(${task.id})" class="btn-icon">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button onclick="pomodoroTimer.deleteTask(${task.id})" class="btn-icon">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }

    saveTasks() {
        localStorage.setItem('pomodoroTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('pomodoroTasks');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveSettings() {
        const settings = {
            workTime: this.workTime,
            breakTime: this.breakTime,
            pomodoroCount: this.pomodoroCount,
            totalStudyTime: this.totalStudyTime
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }

    updateSettings() {
        if (this.workTimeInput) this.workTimeInput.value = this.workTime;
        if (this.breakTimeInput) this.breakTimeInput.value = this.breakTime;
        if (this.pomodoroCountDisplay) this.pomodoroCountDisplay.textContent = this.pomodoroCount;
        if (this.totalTimeDisplay) this.totalTimeDisplay.textContent = this.totalStudyTime;
    }
}

// Initialize the timer and make it globally accessible for the onclick handlers
let pomodoroTimer;
document.addEventListener('DOMContentLoaded', () => {
    pomodoroTimer = new PomodoroTimer();
});