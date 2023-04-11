import React from 'react'

export const CaseStudies: React.FC = () => {
  return (
    <section className='sec-case section bg-gray pb-5 '>
      <div className='container'>
        <h2 className='text-blue mb-3 text-center'>Case Studies</h2>
        <p className='main-content mb-4 text-center'>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
          velit mollit. Exercitation veniam consequat sunt nostrud amet venim aliqua conti.
        </p>
        <div className='row align-items-center py-4 py-md-5'>
          <div className='col-md-6 pe-md-4 '>
            <div className='item-img animated wow fadeIn'>
              <img src={process.env.PUBLIC_URL + '/img/c1.png'} className='img-fluid' alt='' />

              <div className='overlay border-rad fade-overlay'>
                <div className='text'>
                  <a href='#' className='text-white text-decoration-none'>
                    {' '}
                    <img
                      src={process.env.PUBLIC_URL + '/img/iconplay.png'}
                      className='img-fluid d-block mx-auto mb-2'
                      alt=''
                    />
                    Play Video
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6 px-md-4'>
            <p className='content-s'>
              Velit officia consequat duis enim velit veniam consequat sunt nostrud amet venim aliqua conti
            </p>
            <p className='text-justify mb-0'>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco
              est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam
              consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
              Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </p>
          </div>
        </div>
        <div className='row align-items-center py-4 pb-md-5'>
          <div className='col-md-6 px-4 px-md-5 order-change'>
            <p className='content-s'>Duis enim velit mollit veniam consequat sunt nostrud amet venim aliqua conti</p>
            <p className='text-justify mb-0'>
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco
              est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam
              consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
              Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
            </p>
          </div>
          <div className='col-md-6 ps-md-4 '>
            <div className='item-img animated wow fadeIn'>
              <img src={process.env.PUBLIC_URL + '/img/c2.png'} className='img-fluid border-rad' alt='' />

              <div className='overlay border-rad fade-overlay'>
                <div className='text'>
                  <a href='#' className='text-white text-decoration-none'>
                    {' '}
                    <img
                      src={process.env.PUBLIC_URL + '/img/iconplay.png'}
                      className='img-fluid d-block mx-auto mb-2'
                      alt=''
                    />
                    Play Video
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
