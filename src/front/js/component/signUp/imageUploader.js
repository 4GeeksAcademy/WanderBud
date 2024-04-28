import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Card, Button } from 'react-bootstrap';

function ImageUploader({ onImageUpload, initialImageUrl }) {
    const [urlImage, setUrlImage] = useState(initialImageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

    useEffect(() => {
        if (initialImageUrl) {
            setUrlImage(initialImageUrl);
        }
    }, [initialImageUrl]);


    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "presetImageUploader");

        const response = await axios.post("https://api.cloudinary.com/v1_1/dkfphx3dm/image/upload", data);

        console.log(response.data);
        setUrlImage(response.data.secure_url);
        onImageUpload(response.data.secure_url);
    }

    return (
        <div className='d-flex flex-column align-items-center py-0 my-0'>
            <Card.Img variant="top" className="rounded-circle w-50" src={urlImage} />
            <Card.Body>
                <Button className='mt-3' variant="upload">
                    <label htmlFor="image-upload" className='m-0'>
                        Choose your picture
                        <input id="image-upload" type='file' accept='image/*' onChange={handleImageChange} className='d-none' />
                    </label>
                </Button>
            </Card.Body>
        </div>
    )
};

export default ImageUploader;
