import React, { createContext, useCallback, useRef, useState } from 'react';

type CloudinaryFileMap = Record<string, { name: string; url: string }>;

interface StorageContextProps {
  allFiles: Record<string, File[]>;
  uploadedFileIds: React.MutableRefObject<Set<string>>;
  updateFiles: (fieldId: string, files: File[]) => void;
  cloudinaryFiles: Record<string, CloudinaryFileMap>;
  updateCloudinaryFiles: (fieldId: string, files: CloudinaryFileMap) => void;
}

const StorageContext = createContext<StorageContextProps>({
  allFiles: {},
  uploadedFileIds: { current: new Set() },
  updateFiles: () => {},
  cloudinaryFiles: {},
  updateCloudinaryFiles: () => {},
});

const FormBlobStorageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [allFiles, setAllFiles] = useState<Record<string, File[]>>({});
  const uploadedFileIds = useRef<Set<string>>(new Set());
  const [cloudinaryFiles, setCloudinaryFiles] = useState<Record<string, CloudinaryFileMap>>({});

  const updateFiles = useCallback(
    (fieldId: string, files: File[]) => {
      const newFiles: Record<string, File[]> = {};

      Object.entries(allFiles).forEach(([key, value]) => {
        newFiles[key] = value;
      });

      if (!allFiles[fieldId]) {
        newFiles[fieldId] = files;
      } else {
        Object.entries(allFiles).forEach(([key, value]) => {
          if (key !== fieldId) {
            newFiles[key] = value;
          } else {
            newFiles[key] = files;
          }
        });
      }

      setAllFiles(newFiles);
    },
    [allFiles],
  );

  const updateCloudinaryFiles = useCallback((fieldId: string, files: CloudinaryFileMap) => {
    setCloudinaryFiles((prev) => ({ ...prev, [fieldId]: files }));
  }, []);

  return (
    <StorageContext.Provider value={{ allFiles, uploadedFileIds, updateFiles, cloudinaryFiles, updateCloudinaryFiles }}>
      {children}
    </StorageContext.Provider>
  );
};

export const useStorageContext = () => React.useContext(StorageContext);

export default FormBlobStorageProvider;
