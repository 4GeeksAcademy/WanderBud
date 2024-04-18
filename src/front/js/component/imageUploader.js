import React, { useState } from 'react';
import axios from "axios";


function ImageUploader({onImageUpload}) {
    const [urlImage, setUrlImage] = useState("");
    console.log(urlImage);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        console.log(e);
        

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "presetImageUploader");

        const response = await axios.post("https://api.cloudinary.com/v1_1/dkfphx3dm/image/upload", data);

        console.log(response.data);
        setUrlImage(response.data.secure_url);
        onImageUpload(response.data.secure_url);
       

    

    }


    const handleDeleteImage = () => {
        setUrlImage("");
        onImageUpload("");
    }

    return (

        <div>
            <input type='file' accept='"image/*' onChange={handleImageChange} />
            {urlImage && (
                <div>
                    <img src={urlImage} />
                    <button onClick={() => handleDeleteImage()}>Delete Image</button>
                </div>
            )}

        </div>
)};

export default ImageUploader;