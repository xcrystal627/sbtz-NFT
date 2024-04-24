import { PhotoIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef, useState } from "react";

interface ImageUploaderProps {
  onSelectFile: (file: File | null) => void;
}
export default function ImageUploader({ onSelectFile }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      setSelectedImage(file); // プレビュー用にStateに保存
      onSelectFile(file); // 親コンポーネントに選択されたFileを渡す
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {selectedImage ? (
        <>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded"
            className="full object-cover  cursor-pointer"
            onClick={handleImageClick}
          />
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div className="flex justify-center rounded-lg border border-gray-900/25 w-full h-full">
          <div className="text-center w-full h-full">
            <div className="items-center justify-center flex text-sm leading-6 text-gray-600 w-full h-full">
              <label
                htmlFor="file-upload"
                className=" w-full h-full z-50 relative cursor-pointer rounded-md  font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only w-full h-full bg-transparent  relative"
                  style={{
                    background: "transparent",
                    zIndex: 999,
                    position: "relative",
                    display: "contents",
                  }}
                  onChange={handleFileChange}
                />
              </label>
              <img
                style={{ position: "absolute" }}
                src="/whitePlus.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
