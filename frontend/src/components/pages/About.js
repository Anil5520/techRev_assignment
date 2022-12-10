import React from 'react';

const About = () => {
    return (
        <div style={{ marginTop: '100px', color: 'black' }}>
            <h1>Project Assumtions</h1>
            <br />
            <br />
            <br />
            <div style={{ textAlign: "left", marginLeft: "300px", fontSize: "20px", fontFamily: "serif" }}>
                <p>1. Whenever we are updating customer details we have to update Password everytime.</p>
                <p>2. We can Seach and Sort by firstName only.</p>
                <p>3. After deleting document we need to click Reset button for updated customers detail.</p>
                <p>4. Pagination is applied only for fetching data other functionality such as sort and search can give all the matching documents.</p>
                <p>5. Next button is shown even if we don't have any data.</p>
                <p>6. Image is not shown in UI but backend logic is done for that.</p>
            </div>
        </div>
    )
}

export default About