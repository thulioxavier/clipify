import { uploadImage } from "@/server/upload-image";
import { useDropzone } from "react-dropzone";

export const UploadFile = () => {
  const {} = useDropzone({
    maxFiles: 1,
    accept: {
      "image/pnp": [".png"],
      "image/jpg": [".jpg"],
    },
    onDrop: async (acceptFiles, filesRejections) => {
      if (acceptFiles.length) {
        const formData = new FormData();
        formData.append("image", acceptFiles[0]);
        const objectUrl = URL.createObjectURL(acceptFiles[0]);

        const res = await uploadImage({ image: formData });
      }
    },
  });
  return (
    <div>
      <h1>Upload FIle</h1>
    </div>
  );
};
