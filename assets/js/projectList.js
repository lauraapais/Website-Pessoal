document.addEventListener('DOMContentLoaded', function() {
    const listButton = document.getElementById('list');
    const gridButton = document.getElementById('grid');
    const projectGrid = document.getElementById('project-grid');
    const projectListheader = document.getElementById('projectList-header');
    const projectGridContexts = document.querySelectorAll('.projectGrid-context');
    const aosProjects = document.querySelectorAll('.projectGrid-project[data-aos]');

    // Initialize with grid mode active
    projectListheader.style.display = "none";
    gridButton.classList.add('active');
    projectGridContexts.forEach(element => {
        element.style.display = "none";
    });

    // Function to remove AOS attributes
    function removeAosAttributes() {
        aosProjects.forEach(project => {
            project.removeAttribute('data-aos');
            project.removeAttribute('data-aos-offset');
            project.removeAttribute('data-aos-duration');
        });
    }

    // Function to add AOS attributes back (if needed for grid view)
    function addAosAttributes() {
        aosProjects.forEach(project => {
            project.setAttribute('data-aos', 'fade-up');
            project.setAttribute('data-aos-offset', '100');
            project.setAttribute('data-aos-duration', '1000');
        });
    }

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

        // Remove AOS attributes when switching to list view
        removeAosAttributes();
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

        // Add AOS attributes back when switching to grid view
        addAosAttributes();
    });
});