document.addEventListener('DOMContentLoaded', function() {
    const listButton = document.getElementById('list');
    const gridButton = document.getElementById('grid');
    const projectGrid = document.getElementById('project-grid');
    const projectListheader = document.getElementById('projectList-header');
    const projectGridContexts = document.querySelectorAll('.projectGrid-context'); // Get ALL elements
    
    // Initialize with grid mode active
    projectListheader.style.display = "none";
    gridButton.classList.add('active');
    projectGridContexts.forEach(element => {
        element.style.display = "none";
    });

    listButton.addEventListener('click', function() {
        projectGrid.classList.remove('projectGrid');
        projectGrid.classList.add('projectList');

        projectGrid.style.display = "none";
        setTimeout(function() {projectGrid.style.display = "grid";}, 1);
        
        listButton.classList.add('active');
        gridButton.classList.remove('active');

        projectListheader.style.display = "grid";
        
        projectGridContexts.forEach(element => {
            element.style.display = "block";
        });
    });
    
    gridButton.addEventListener('click', function() {
        projectGrid.classList.remove('projectList');
        projectGrid.classList.add('projectGrid');

        projectGrid.style.display = "none";
        setTimeout(function() {projectGrid.style.display = "grid";}, 1);
        
        gridButton.classList.add('active');
        listButton.classList.remove('active');

        projectListheader.style.display = "none";
        
        projectGridContexts.forEach(element => {
            element.style.display = "none";
        });
    });
});