import { Box, Stepper, Step, StepLabel, Typography, StepContent } from '@mui/material';
import before from '../images/test/test_broken.jpg';
import after from '../images/test/test_fixed.jpg';
import cameraIcon from './icons/camera.png';
import '../css/timeline.css';
import { useEffect, useState } from 'react';

const steps = ['Order placed', 'ETA', 'On our way', 'Job started', 'Finished']

export default function PayBookTimeline() {

    const [activeStep, setActiveStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [imgUploaded, setImgUploaded] = useState(false);

    function handleNextStep() {
        setActiveStep((prevStep) => prevStep + 1);
    }

    useEffect(() => {
        if (window.innerWidth <= 800) {
            setIsMobile(true);
        } 
    }, []);

    return(
        <div className="center">
            {!isMobile && <Box sx={{ width: '100%', mt: 7, mb: 6 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(element => (
                        <Step key={element} sx={{
                                '& .MuiStepLabel-root .Mui-completed': {
                                    color: '#9a73dd', // circle color (COMPLETED)
                                },
                                '& .MuiStepLabel-root .Mui-active': {
                                    color: '#9a73dd', // circle color (ACTIVE)
                                },
                                '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                {
                                color: '#363636', // Just text label (COMPLETED)
                                },
                                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                {
                                color: '#363636', // Just text label (ACTIVE)
                                }
                            }}>
                            <StepLabel>{element}</StepLabel>
                            {element === 'ETA' && <div className="center-content">
                                <span className='eta'></span>
                            </div> }
                            {(element === 'Job started' && imgUploaded) && <div className="center-content">
                                <img className='window-image' src={before} alt="" />
                            </div> }
                            {(element === 'Job started' && !imgUploaded) && <div className="center-content cam-icon-frame">
                                <img className='img-upload' src={cameraIcon} alt="" />
                            </div> }
                            {(element === 'Finished' && imgUploaded) && <div className="center-content">
                                <img className='window-image' src={after} alt="" />
                            </div> }
                            {(element === 'Finished' && !imgUploaded) && <div className="center-content cam-icon-frame">
                                <img className='img-upload' src={cameraIcon} alt="" />
                            </div> }
                        </Step>
                    ))}
                </Stepper>
            </Box>}
            {isMobile &&
                <div className="mobile-container">
                    <Box sx={{ maxWidth: 400 }}>
                        <Stepper activeStep={activeStep} orientation='vertical'>
                            {steps.map(element => (
                                <Step key={element} expanded={true} sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                        color: '#9a73dd', // circle color (COMPLETED)
                                    },
                                    '& .MuiStepLabel-root .Mui-active': {
                                        color: '#9a73dd', // circle color (ACTIVE)
                                    },
                                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                    {
                                    color: '#363636', // Just text label (COMPLETED)
                                    },
                                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                    {
                                    color: '#363636', // Just text label (ACTIVE)
                                    }
                                }}>
                                    <StepLabel>{element}</StepLabel>
                                    <StepContent>
                                        {element === 'ETA' &&
                                            <Typography></Typography> }
                                        {(element === 'Job started' && imgUploaded) && 
                                            <img className='window-image' src={before} alt="" /> }
                                        {(element === 'Job started' && !imgUploaded) && <div className="center-content cam-icon-frame">
                                            <img className='img-upload' src={cameraIcon} alt="" />
                                        </div> }
                                        {(element === 'Finished' && imgUploaded) &&
                                            <img className='window-image' src={after} alt="" /> }
                                        {(element === 'Finished' && !imgUploaded) && <div className="center-content cam-icon-frame">
                                            <img className='img-upload' src={cameraIcon} alt="" />
                                        </div> }
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </div>
            }
        </div>
    )
}