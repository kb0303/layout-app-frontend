import React from 'react';

const UserData = ({ userData, handleModal }) => {

	return (
		<>
			{userData && (
				<>
					<img src={`https://layout-app-backend.onrender.com/uploads/${userData.imageUrl}`} alt="User" />
					<h3 className='w-50'>Hello, My name is {userData.name} and I'm {userData.age} years old living in {userData.place}</h3>
					<div className='btns'>
						{/* Use handleModal directly */}
						<button className='add-btn' onClick={() => handleModal(false)}>Add</button>
						<button className='update-btn' onClick={() => handleModal(true)}>Update</button>
					</div>
				</>
			)}
		</>
	);
};

export default UserData;
