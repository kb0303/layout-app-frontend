import React, { useState, useEffect } from 'react';
import { useResizable } from 'react-resizable-layout';
import { cn } from '../utils/cn';
import Resizer from './Resizer';
import UserData from './UserData';
import SampleImg from '../sample.jpg';
import Loader from './Loader';

const ResizableContents = () => {
    // State variables
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [updateData, setUpdateData] = useState(null); // State to store data for update
    const [alertMessage, setAlertMessage] = useState(null); // State to store alert message
    const [alertType, setAlertType] = useState(null); // State to store alert type
    const [imageLoading, setImageLoading] = useState(true); // State to track image loading
    const [isLoading, setIsLoading] = useState(false); // State to track form submission loading
    const [isResetting, setIsResetting] = useState(false); // State to track reset loading

    // Fetch user data when showModal state changes
    useEffect(() => {
        fetchUserData();
    }, [showModal]);

    // Function to fetch user data from the backend
    const fetchUserData = async () => {
        try {
            const response = await fetch('https://layout-app-backend.onrender.com/api/data1');
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await response.json();

            // Set the user data to the last element
            if (Array.isArray(userData) && userData.length > 0) {
                setUpdateData(userData[userData.length - 1]);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Function to handle modal opening
    const handleModal = (isUpdate) => {
        if (isUpdate) {
            setShowModal(true);
        } else {
            setUpdateData(null);
            setShowModal(true);
        }
    };

    // Function to handle form submission
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set isLoading to true while sending the request

        const formData = new FormData(event.target);

        try {
            const url = updateData ? `https://layout-app-backend.onrender.com/api/data1/${updateData._id}` : 'https://layout-app-backend.onrender.com/api/data1/add';
            const method = updateData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }
            setShowModal(false);
            const responseData = await response.json();
            displayAlert(responseData.executionTime);
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsLoading(false); // Set isLoading to false after request completes
        }
    };

    // Function to handle reset
    const handleReset = async () => {
        setIsResetting(true); // Set isResetting to true while sending the request

        try {
            const response = await fetch('https://layout-app-backend.onrender.com/api/data1/reset', {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to reset data');
            }

            // Reset user data
            setUpdateData(null);
            const responseData = await response.json();
            displayAlert(responseData.executionTime);
        } catch (error) {
            console.error('Error resetting data:', error);
        } finally {
            setIsResetting(false); // Set isResetting to false after request completes
        }
    };

    // Function to display alert
    const displayAlert = (executionTime) => {
        setAlertType('info');
        setAlertMessage(`Execution time: ${executionTime} ms`);
        setTimeout(() => {
            setAlertMessage(null);
        }, 5000);
    };

    // Function to handle image load
    const handleImageLoad = () => {
        // Set imageLoading to false when the image is loaded
        setImageLoading(false);
    };

    // Resizable layout hooks
    const {
        isDragging: isTerminalDragging,
        position: terminalH,
        splitterProps: terminalDragBarProps
    } = useResizable({
        axis: 'y',
        initial: 200,
        min: 50,
        reverse: true
    });

    const {
        isDragging: isPluginDragging,
        position: pluginW,
        splitterProps: pluginDragBarProps
    } = useResizable({
        axis: 'x',
        initial: 500,
        min: 50,
        reverse: true
    });

    return (
        <>
            <div className={"flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"}>
                <div className={"flex grow"}>
                    <div className={"flex grow"}>
                        <div className={"grow bg-darker contents box1"}>
                            {updateData ? (
                                <>
                                    <UserData
                                        userData={updateData}
                                        handleModal={handleModal}
                                    />
                                    {/* Reset button */}
                                    <button className={`btn btn-danger reset-btn ${isResetting ? 'disabled' : ''}`} onClick={handleReset}>{isResetting ? <Loader /> : 'Reset Data'}</button>
                                </>
                            ) : (
                                <>
                                    {imageLoading && <Loader />} 
                                    <img
                                        src={SampleImg}
                                        alt="User"
                                        onLoad={handleImageLoad} // Call handleImageLoad when image is loaded
                                        style={{ display: imageLoading ? 'none' : 'block' }} // Show image when loaded
                                    />


                                    <h3 className='w-50'>Hello, My name is John Doe and I'm 18 years old living in New York City</h3>
                                    <div className='btns'>
                                        <button className={`add-btn ${isLoading ? 'disabled' : ''}`} onClick={() => handleModal()}>{isLoading ? <Loader /> : 'Add'}</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <Resizer isDragging={isPluginDragging} {...pluginDragBarProps} />
                        <div className={cn("contents box2", isPluginDragging && "dragging")} style={{ width: pluginW }}>
                            More Data
                        </div>
                    </div>
                </div>
                <Resizer dir={"horizontal"} isDragging={isTerminalDragging} {...terminalDragBarProps} />
                <div className={cn("shrink-0 bg-darker contents", isTerminalDragging && "dragging")} style={{ height: terminalH }}>
                    More Data
                </div>
            </div>

            {/* Alert */}
            {alertMessage && (
                <div className={`alert alert-${alertType} position-fixed bottom-0 end-0 m-3`} role="alert">
                    {alertMessage}
                </div>
            )}

            {/* Modal */}
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{updateData ? 'Update' : 'Add New'} Content</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" name='name' defaultValue={updateData?.name} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="age" className="form-label">Age</label>
                                    <input type="text" className="form-control" id="age" name='age' defaultValue={updateData?.age} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="place" className="form-label">Place</label>
                                    <input type="text" className="form-control" id="place" name='place' defaultValue={updateData?.place} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="imageUrl" className="form-label">Image Url</label>
                                    <input type="file" accept="images/*" className="form-control" id="imageUrl" name='imageUrl' />
                                </div>
                                {/* Conditional rendering for loader */}
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal backdrop */}
            <div className={`modal-backdrop ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}></div>
        </>
    );
};

export default ResizableContents;
