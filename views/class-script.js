const students = await response.json();
console.log(`Fetched ${students.length} students`);

if (loadingMessage) {
    loadingMessage.remove();
}

// Fetch privacy states
const privacyResponse = await fetch('/get-all-privacy-states', {
    cache: 'no-store',
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    }
});
const privacyStates = await privacyResponse.json();
console.log('Privacy states:', privacyStates);

// Update students with privacy states
const studentsWithPrivacy = students.map(student => {
    // Ensure consistent path format without trailing slash
    const portfolioPath = `/portfolios/PhumdhamPrimary/classes/${classId}/${student.username}/${student.username}.html`.replace(/\/+/g, '/');
    const isPublic = privacyStates[portfolioPath];
    console.log(`${student.username} privacy:`, isPublic);
    return {
        ...student,
        portfolio_path: portfolioPath,
        avatar_path: `/portfolios/PhumdhamPrimary/classes/${classId}/${student.username}/images/${student.username}.jpg`.replace(/\/+/g, '/'),
        is_public: isPublic
    };
});

const visiblePortfolios = studentsWithPrivacy.filter(student => 
    student && (student.is_public || authData.authenticated)
);

if (visiblePortfolios.length === 0) {
    container.innerHTML = '<p style="text-align: center; width: 100%;">No portfolios found.</p>';
    return;
}

container.innerHTML = '';
visiblePortfolios.forEach(student => {
    const card = createPortfolioCard(student);
    container.appendChild(card);
}); 