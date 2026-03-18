    import { setupTheme } from './assets/js/main.js';

    console.log('Project.html script running');
    // Theme setup
    setupTheme();
    
    // Parse URL params
    // Mock for node
    const window = { location: { search: '' } };
    const URLSearchParams = class { get() { return 'p1'; } };
    
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    // Lang Logic
    // Mock localstorage
    const localStorage = { getItem() { return 'zh'; }, setItem() {} };
    // const toggleBtn = document.getElementById('lang-toggle');
