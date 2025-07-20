// Sprint Analytics Dashboard - Main Application
class SprintDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.charts = {};
        this.filters = {
            week: '',
            ticketType: '',
            assignee: '',
            taskForce: '',
            epic: ''
        };
        
        this.init();
        this.loadSampleData();
    }

    init() {
        this.setupEventListeners();
        this.updateSummaryStats();
    }

    setupEventListeners() {
        // File upload
        document.getElementById('csvUpload').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // Filter dropdowns
        const filterIds = ['weekFilter', 'typeFilter', 'assigneeFilter', 'taskForceFilter', 'epicFilter'];
        filterIds.forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.updateFilter(id, e.target.value);
            });
        });

        // Clear filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
        });
    }

    loadSampleData() {
        // Sample data for demonstration
        this.data = [
            {
                sprint: 'Sprint 23',
                week: '2024-W01',
                ticketId: 'PROJ-123',
                ticketType: 'Feature',
                assignee: 'Alice Johnson',
                taskForce: 'Frontend',
                epic: 'User Dashboard',
                storyPoints: '8',
                status: 'Completed',
                startDate: '2024-01-01',
                completedDate: '2024-01-05'
            },
            {
                sprint: 'Sprint 23',
                week: '2024-W01',
                ticketId: 'PROJ-124',
                ticketType: 'Bug',
                assignee: 'Bob Smith',
                taskForce: 'Backend',
                epic: 'API Optimization',
                storyPoints: '3',
                status: 'Completed',
                startDate: '2024-01-02',
                completedDate: '2024-01-04'
            },
            {
                sprint: 'Sprint 24',
                week: '2024-W02',
                ticketId: 'PROJ-125',
                ticketType: 'Feature',
                assignee: 'Alice Johnson',
                taskForce: 'Frontend',
                epic: 'User Dashboard',
                storyPoints: '13',
                status: 'In Progress',
                startDate: '2024-01-08',
                completedDate: null
            },
            {
                sprint: 'Sprint 24',
                week: '2024-W02',
                ticketId: 'PROJ-126',
                ticketType: 'Feature',
                assignee: 'Charlie Brown',
                taskForce: 'Backend',
                epic: 'Payment System',
                storyPoints: '5',
                status: 'Completed',
                startDate: '2024-01-08',
                completedDate: '2024-01-12'
            },
            {
                sprint: 'Sprint 25',
                week: '2024-W03',
                ticketId: 'PROJ-127',
                ticketType: 'Bug',
                assignee: 'Alice Johnson',
                taskForce: 'Frontend',
                epic: 'User Dashboard',
                storyPoints: '2',
                status: 'Completed',
                startDate: '2024-01-15',
                completedDate: '2024-01-16'
            },
            {
                sprint: 'Sprint 25',
                week: '2024-W03',
                ticketId: 'PROJ-128',
                ticketType: 'Feature',
                assignee: 'Bob Smith',
                taskForce: 'Backend',
                epic: 'Payment System',
                storyPoints: '8',
                status: 'Completed',
                startDate: '2024-01-15',
                completedDate: '2024-01-19'
            }
        ];

        this.updateFilterOptions();
        this.applyFilters();
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showUploadStatus('Parsing CSV...', 'loading');

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    this.showUploadStatus('Error parsing CSV file', 'error');
                    return;
                }

                this.data = results.data.filter(row => {
                    // Filter out empty rows
                    return Object.values(row).some(value => value && value.trim());
                });

                this.showUploadStatus(`Successfully loaded ${this.data.length} records`, 'success');
                this.updateFilterOptions();
                this.applyFilters();
            },
            error: (error) => {
                this.showUploadStatus('Error reading file', 'error');
                console.error('Papa Parse error:', error);
            }
        });
    }

    showUploadStatus(message, type) {
        const statusElement = document.getElementById('uploadStatus');
        statusElement.textContent = message;
        statusElement.className = `upload-status ${type}`;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'upload-status';
            }, 3000);
        }
    }

    updateFilterOptions() {
        const filterMappings = {
            weekFilter: 'week',
            typeFilter: 'ticketType',
            assigneeFilter: 'assignee',
            taskForceFilter: 'taskForce',
            epicFilter: 'epic'
        };

        Object.entries(filterMappings).forEach(([elementId, dataKey]) => {
            const select = document.getElementById(elementId);
            const uniqueValues = [...new Set(this.data.map(item => item[dataKey]).filter(Boolean))];
            
            // Clear existing options except the first one
            select.innerHTML = select.querySelector('option').outerHTML;
            
            // Add unique values
            uniqueValues.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        });
    }

    updateFilter(filterId, value) {
        const filterMap = {
            weekFilter: 'week',
            typeFilter: 'ticketType',
            assigneeFilter: 'assignee',
            taskForceFilter: 'taskForce',
            epicFilter: 'epic'
        };

        this.filters[filterMap[filterId]] = value;
        this.applyFilters();
    }

    clearAllFilters() {
        this.filters = {
            week: '',
            ticketType: '',
            assignee: '',
            taskForce: '',
            epic: ''
        };

        // Reset all dropdowns
        document.getElementById('weekFilter').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('assigneeFilter').value = '';
        document.getElementById('taskForceFilter').value = '';
        document.getElementById('epicFilter').value = '';

        this.applyFilters();
    }

    applyFilters() {
        this.filteredData = this.data.filter(item => {
            return (
                (!this.filters.week || item.week === this.filters.week) &&
                (!this.filters.ticketType || item.ticketType === this.filters.ticketType) &&
                (!this.filters.assignee || item.assignee === this.filters.assignee) &&
                (!this.filters.taskForce || item.taskForce === this.filters.taskForce) &&
                (!this.filters.epic || item.epic === this.filters.epic)
            );
        });

        this.updateSummaryStats();
        this.updateCharts();
    }

    updateSummaryStats() {
        const completedTickets = this.filteredData.filter(item => item.status === 'Completed').length;
        const totalPoints = this.filteredData
            .filter(item => item.status === 'Completed')
            .reduce((sum, item) => sum + (parseInt(item.storyPoints) || 0), 0);
        const activeDevelopers = [...new Set(this.filteredData.map(item => item.assignee).filter(Boolean))].length;
        const totalSprints = [...new Set(this.filteredData.map(item => item.sprint).filter(Boolean))].length;

        document.getElementById('completedTickets').textContent = completedTickets;
        document.getElementById('totalPoints').textContent = totalPoints;
        document.getElementById('activeDevelopers').textContent = activeDevelopers;
        document.getElementById('totalSprints').textContent = totalSprints;
    }

    updateCharts() {
        this.updateVelocityChart();
        this.updateTeamChart();
        this.updateTicketTypeChart();
        this.updateEpicChart();
    }

    updateVelocityChart() {
        const ctx = document.getElementById('velocityChart');
        
        // Calculate sprint velocity
        const sprintVelocity = {};
        this.filteredData.forEach(item => {
            if (item.status === 'Completed') {
                const points = parseInt(item.storyPoints) || 0;
                sprintVelocity[item.sprint] = (sprintVelocity[item.sprint] || 0) + points;
            }
        });

        const labels = Object.keys(sprintVelocity).sort();
        const data = labels.map(sprint => sprintVelocity[sprint]);

        if (this.charts.velocity) {
            this.charts.velocity.destroy();
        }

        this.charts.velocity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Velocity (Story Points)',
                    data: data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateTeamChart() {
        const ctx = document.getElementById('teamChart');
        
        // Calculate team workload
        const assigneePoints = {};
        this.filteredData.forEach(item => {
            const points = parseInt(item.storyPoints) || 0;
            assigneePoints[item.assignee] = (assigneePoints[item.assignee] || 0) + points;
        });

        const labels = Object.keys(assigneePoints);
        const data = labels.map(assignee => assigneePoints[assignee]);
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB'
        ];

        if (this.charts.team) {
            this.charts.team.destroy();
        }

        this.charts.team = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    updateTicketTypeChart() {
        const ctx = document.getElementById('ticketTypeChart');
        
        // Calculate ticket type distribution
        const typeCounts = {};
        this.filteredData.forEach(item => {
            typeCounts[item.ticketType] = (typeCounts[item.ticketType] || 0) + 1;
        });

        const labels = Object.keys(typeCounts);
        const data = labels.map(type => typeCounts[type]);

        if (this.charts.ticketType) {
            this.charts.ticketType.destroy();
        }

        this.charts.ticketType = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Tickets',
                    data: data,
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ],
                    borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(239, 68, 68, 1)',
                        'rgba(168, 85, 247, 1)',
                        'rgba(251, 191, 36, 1)',
                        'rgba(59, 130, 246, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    updateEpicChart() {
        const ctx = document.getElementById('epicChart');
        
        // Calculate epic progress
        const epicStats = {};
        this.filteredData.forEach(item => {
            if (!epicStats[item.epic]) {
                epicStats[item.epic] = { total: 0, completed: 0 };
            }
            const points = parseInt(item.storyPoints) || 0;
            epicStats[item.epic].total += points;
            if (item.status === 'Completed') {
                epicStats[item.epic].completed += points;
            }
        });

        const labels = Object.keys(epicStats);
        const completedData = labels.map(epic => epicStats[epic].completed);
        const remainingData = labels.map(epic => epicStats[epic].total - epicStats[epic].completed);

        if (this.charts.epic) {
            this.charts.epic.destroy();
        }

        this.charts.epic = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(label => label.length > 15 ? label.substring(0, 15) + '...' : label),
                datasets: [{
                    label: 'Completed',
                    data: completedData,
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1
                }, {
                    label: 'Remaining',
                    data: remainingData,
                    backgroundColor: 'rgba(251, 191, 36, 0.8)',
                    borderColor: 'rgba(251, 191, 36, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Utility method to get unique values from data
    getUniqueValues(key) {
        return [...new Set(this.data.map(item => item[key]).filter(Boolean))];
    }

    // Method to export filtered data as CSV
    exportData() {
        if (this.filteredData.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(this.filteredData[0]);
        const csvContent = [
            headers.join(','),
            ...this.filteredData.map(row => 
                headers.map(header => `"${row[header] || ''}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sprint_data_filtered.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Method to refresh all charts
    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.update();
            }
        });
    }

    // Method to handle window resize
    handleResize() {
        this.refreshCharts();
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new SprintDashboard();
    
    // Handle window resize for responsive charts
    window.addEventListener('resize', () => {
        dashboard.handleResize();
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + E to export data
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            dashboard.exportData();
        }
        
        // Ctrl/Cmd + R to clear filters
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            dashboard.clearAllFilters();
        }
    });
    
    // Make dashboard available globally for debugging
    window.dashboard = dashboard;
});