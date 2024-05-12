import React, { useState, useEffect } from 'react';
import { useResizable } from 'react-resizable-layout';
import { cn } from '../utils/cn';
import Resizer from './Resizer';
import UserData from './UserData';
import SampleImg from '../sample.jpg';

const ResizableContents = () => {
	const [showModal, setShowModal] = useState(false); // State to manage modal visibility
	const [updateData, setUpdateData] = useState(null); // State to store data for update

	useEffect(() => {
		// Fetch user data from the backend when the component mounts
		fetchUserData();
	}, [showModal]);

	// Function to fetch user data from the backend
	const fetchUserData = async () => {
		try {
			const response = await fetch('http://localhost:8080/api/data1');
			if (!response.ok) {
				throw new Error('Failed to fetch user data');
			}
			const userData = await response.json();
			// Set the user data to the last element (assuming it's the latest added content)
			if (Array.isArray(userData) && userData.length > 0) {
				setUpdateData(userData[userData.length - 1]);
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const handleModal = (isUpdate) => {
		if (isUpdate) {
			setShowModal(true);
		} else {
			setUpdateData(null);
			setShowModal(true);
		}
	};

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

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		try {
			const url = updateData ? `http://localhost:8080/api/data1/${updateData._id}` : 'http://localhost:8080/api/data1/add';
			const method = updateData ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method: method,
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to save changes');
			}
			setShowModal(false);

		} catch (error) {
			console.error('Error saving changes:', error);
		}
	};

	return (
		<>
			<div className={"flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"}>
				<div className={"flex grow"}>
					<div className={"flex grow"}>
						<div className={"grow bg-darker contents box1"}>
							{updateData ? (
								<UserData
									userData={updateData}
									handleModal={handleModal}
								/>
							) : (
								<>
									<img src={SampleImg} alt="User" />
									<h3>Hello, My name is John Doe and I'm 18 years old living in New York City</h3>
									<div className='btns'>
										<button className='add-btn' onClick={() => handleModal()}>Add</button>
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
								<button type="submit" className="btn btn-primary">Save changes</button>
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
