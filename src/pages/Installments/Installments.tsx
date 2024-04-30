import './Installments.css'
import React from 'react'
import { scrollToElementWithOffset } from '@glass/utils/index'

export const Installments: React.FC = () => {
  return (
    <div className='installments-page'>
      <div className='padding-32'></div>

      <div className='page-header'>
        <div className='category'>Benefits of installments</div>
        <div className='title'>Losing money with insurance claim, but saving money with installments. How?</div>
        <div className='clock'>
          <img src={process.env.PUBLIC_URL + '/images/clock.svg'} className='img-fluid' alt='' />
          <span>5 min read</span>
        </div>
      </div>

      <div className='summary'>
        <strong>Summary:</strong> Opting for installments over insurance claims brings long-term financial benefits. It
        boosts your credit score, leading to better loan terms, while also avoiding potential premium hikes over time.
        This enhances financial stability and savings.
      </div>

      <img src={process.env.PUBLIC_URL + '/images/clock-bg.png'} className='img-fluid' alt='' />

      <div className='in-this-article'>
        <div className='category'>In this article</div>
        <div>
          <div className='title' onClick={() => scrollToElementWithOffset('article-1', 148)}>
            Long-Term Cost Savings with Installments
          </div>
          <div className='title mt-3' onClick={() => scrollToElementWithOffset('article-2', 148)}>
            Building Financial Stability with Installments
          </div>
        </div>
      </div>

      <div className='padding-48'></div>

      <div className='article' id='article-1'>
        <div className='title'>
          <div>1.</div>
          <div>Long-Term Cost Savings with Installments</div>
        </div>
        <div className='article-content'>
          <strong>Insurance Premiums Increase Over Time:</strong> Despite assurances from insurance companies that
          claims won&apos;t affect your premiums, many customers find the opposite to be true. Yearly premium hikes,
          even without claims, are common.
        </div>
        <div className='article-content'>
          <strong>Insurance is a Business:</strong> Insurance companies aim to make profits. When you make a claim, you
          become more costly for them, potentially leading to higher premiums down the line.
        </div>
        <div className='article-content'>
          <strong>Uncertainty in Pricing:</strong> Insurance premiums can rise unpredictably. Factors like inflation
          play a role, but the exact calculations remain opaque.
        </div>
      </div>

      <div className='padding-40'></div>

      <div className='article' id='article-2'>
        <div className='title'>
          <div>2.</div>
          <div>Building Financial Stability with Installments</div>
        </div>
        <div className='article-content'>
          <strong>Positive Impact on Credit Score:</strong> Setting up an installment plan benefits your credit score.
          This information is shared with major credit agencies like Experian, Equifax, and TransUnion.
        </div>
        <div className='article-content'>
          <strong>Responsible Lending:</strong> By borrowing and repaying as agreed, you demonstrate financial
          responsibility, boosting your credit score.
        </div>
        <div className='article-content'>
          <strong>Long-Term Financial Benefits:</strong> A higher credit score opens doors to better mortgage deals and
          lower interest rates on loans like car financing. Ultimately, this saves you money by reducing interest
          payments.
        </div>
        <div className='article-content'>
          <strong>Building Credit History:</strong> Your credit score reflects your financial history, which takes time
          to build. Paying for our service in full won&apos;t enhance your credit score.
        </div>
        <div className='article-content'>
          Navigating Modern Life: Mortgages, loans, and financing are essential aspects of modern living. A good credit
          score makes these transactions smoother and more affordable.
        </div>
      </div>

      <div className='padding-40'></div>

      <div className='article'>
        <div className='title'>
          <div>Final thoughts</div>
        </div>
        <div className='article-content'>
          Opting for installments over insurance claims is a savvy move. It prevents premium hikes and promotes
          stability. With an improved credit score, you access better loan terms and lower interest rates, securing your
          financial future. Make the smart choice today for better financial stability.
        </div>
      </div>

      <div className='padding-64'></div>
      <div className='padding-64'></div>
    </div>
  )
}
