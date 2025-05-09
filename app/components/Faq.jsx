import React, {useEffect} from 'react'

function Faq() {
 

    useEffect(() =>{
        const viewMoreButton = document.getElementById('viewMore');
        const viewLessButton = document.getElementById('viewLess');
        const hiddenItems = document.querySelectorAll('.hidden');

        viewMoreButton.addEventListener('click', () => {
            hiddenItems.forEach(item => item.classList.remove('hidden'));
            viewMoreButton.style.display = 'none';
            viewLessButton.style.display = 'block';
        });

        viewLessButton.addEventListener('click', () => {
            hiddenItems.forEach(item => item.classList.add('hidden'));
            viewMoreButton.style.display = 'block';
            viewLessButton.style.display = 'none';
        });
    })
       

    return (
        <>
            <div className="faq-container">
                <h2>Frequently Asked Questions</h2>

                <div className="faq-list">
                    <div className="faq-item">
                        <button className="faq-question">
                            Does CRX ask for any upfront payment?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>We never request upfront payments for loan approval. The money is transferred immediately after the contract is signed.</p>
                        </div>
                    </div>

                    <div className="faq-item">
                        <button className="faq-question">
                            Do we lend to people with bad credit?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>CRX does not provide loans to individuals with bad credit.</p>
                        </div>
                    </div>

                    <div className="faq-item">
                        <button className="faq-question">
                            What is the loan approval timeframe?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>The approval process usually takes between 24 and 48 hours after submission.</p>
                        </div>
                    </div>

                    <div className="faq-item hidden">
                        <button className="faq-question">
                            What documents are required?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>Government ID, proof of address, and proof of income are required.</p>
                        </div>
                    </div>

                    <div className="faq-item hidden">
                        <button className="faq-question">
                            Are there any hidden fees?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>No, all costs are clearly stated before signing the contract.</p>
                        </div>
                    </div>

                    <div className="faq-item hidden">
                        <button className="faq-question">
                            Can I repay my loan early without penalty?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>Yes, early repayment is allowed without any penalties.</p>
                        </div>
                    </div>

                    <div className="faq-item hidden">
                        <button className="faq-question">
                            What are the interest rates?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>Interest rates vary based on your credit profile and loan amount.</p>
                        </div>
                    </div>

                    <div className="faq-item hidden">
                        <button className="faq-question">
                            How do I apply for a loan?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>You can apply online through our website by filling out the loan application form.</p>
                        </div>
                    </div>

                    <div className="faq-item hidden">
                        <button className="faq-question">
                            What happens if I miss a payment?
                            <span className="arrow">▼</span>
                        </button>
                        <div className="faq-answer">
                            <p>Missing a payment may result in late fees and could affect your credit score.</p>
                        </div>
                    </div>
                </div>

                <button id="viewMore">View More</button>
                <button id="viewLess">View Less</button>
            </div>


        </>
    )
}

export default Faq