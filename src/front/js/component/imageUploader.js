import React, { useState } from 'react';
import axios from "axios";
import "../../styles/profile.css"


function ImageUploader({ onImageUpload }) {
    const [urlImage, setUrlImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

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


    // const handleDeleteImage = () => {
    //     setUrlImage("");
    //     onImageUpload("");
    // }

    return (
        <div className='uploader-container'>
            <div className="card" style={{ width: "200px" }}>
                <div className='profile-img'>
                    <img src={urlImage} />
                    {/* <button onClick={() => handleDeleteImage()}>Delete Image</button> */}
                </div>
            </div>
            <div className="card-body">
                <button className='btn-pic_profile mt-3'>
                    <label htmlFor="image-upload">
                        Choose your picture
                        <input id="image-upload" type='file' accept='image/*' onChange={handleImageChange} style={{ display: "none" }} />
                    </label>
                </button>
            </div>
        </div>
    )
};

export default ImageUploader;