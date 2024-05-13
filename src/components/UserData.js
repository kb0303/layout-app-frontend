import React from 'react';

const UserData = ({ userData, handleModal }) => {

    return (
        <>
            {userData && (
                <>
                    {/* Display user image */}
                    <img src={`https://layout-app-backend.onrender.com/uploads/${userData.imageUrl}`} alt="User" />
                    {/* Display user information */}
                    <h3 className='w-50'>Hello, My name is {userData.name} and I'm {userData.age} years old living in {userData.place}</h3>
                    {/* Button to update user data */}
                    <div className='btns'>
                        <button className='update-btn' onClick={() => handleModal(true)}>Update</button>
                    </div>
                </>
            )}
        </>
    );
};

export default UserData;
