chrome.runtime.onInstalled.addListener(() => {
  console.log('TaskFlow extension installed');
  
  chrome.storage.local.set({
    taskflow_tasks: [],
    taskflow_theme: 'light'
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getTasks') {
    chrome.storage.local.get('taskflow_tasks', (result) => {
      sendResponse({ tasks: result.taskflow_tasks || [] });
    });
    return true;
  }

  if (message.type === 'notifyDue') {
    showDueNotification(message.task);
  }
});

function showDueNotification(task) {
  if (Notification.permission === 'granted') {
    new Notification('TaskFlow - Due Task', {
      body: `"${task.title}" is due today!`,
      icon: 'icons/icon128.png',
      tag: task.id
    });
  }
}

chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.action.openPopup();
});

if (chrome.Notification) {
  Notification.requestPermission().catch(() => {});
}

chrome.alarms.create('checkDueTasks', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkDueTasks') {
    checkDueTasks();
  }
});

function checkDueTasks() {
  chrome.storage.local.get('taskflow_tasks', (result) => {
    const tasks = result.taskflow_tasks || [];
    const today = new Date().toISOString().split('T')[0];
    
    tasks.forEach(task => {
      if (task.dueDate === today && !task.completed) {
        showDueNotification(task);
      }
    });
  });
}