import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';


const { BASE_URL } = Constants.expoConfig.extra;
const { API_KEY }  = Constants.expoConfig.extra;

export const TRANSLATE_FILE = `${BASE_URL}translate_file`
export const TRANSLATE_TEXT = `${BASE_URL}translate`


export const translateFile = async (uri, fromLanguage, toLanguage) => {
    try {
        const uploadResponse = await FileSystem.uploadAsync(
            TRANSLATE_FILE,
            uri,
            {
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'file',
                parameters: {
                    source: fromLanguage,
                    target: toLanguage,
                    api_key: API_KEY,
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return uploadResponse
    } catch (error) {
        console.error('Error uploading file at API:', error);
    }
}

// not used anywhere
export const translateText = async (text, fromLanguage, toLanguage, params) => {
        if (inputValue.length > 0) {
          if (inputValue.trim()) {
            setMessages([{ text: inputValue, id: Date.now().toString() }]);
            setInputValue('');
          }
          await axios.post(endpoint, params)
            .then(response => {
              setResponse([{ text: response.data.translatedText, id: Date.now().toString() }])
            })
            .catch(error => {
              console.error('Error during translation at API:', error);
              throw error;  
            });
        } else {
          return
        }
}