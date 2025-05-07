import Quill from 'quill';

import 'react-quill/dist/quill.snow.css';
import '../styles/ArticleEditor.css';

const Clipboard = Quill.import('modules/clipboard');

class CustomClipboard extends Clipboard {
  async onPaste(e) {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      const fileItems = Array.from(items).filter(item => item.type.startsWith('image'));

      if (fileItems.length) {
        e.preventDefault();
        const editor = this.quill;
        const uploadPromises = fileItems.map(item => {
          return new Promise((resolve, reject) => {
            const blob = item.getAsFile();
            const reader = new FileReader();

            reader.onload = () => {
              resolve(reader.result);
            };

            reader.onerror = () => {
              reject(new Error('Error reading image file'));
            };

            reader.readAsDataURL(blob);
          });
        });

        try {
          const images = await Promise.all(uploadPromises);
          const range = editor.getSelection(true);

          images.forEach(image => {
            editor.insertEmbed(range.index, 'image', image, Quill.sources.USER);
            range.index += 1;
          });
          editor.setSelection(range.index, Quill.sources.SILENT);
        } catch (error) {
          console.error('Error uploading images:', error);
        }
      } else {
        super.onPaste(e);
      }
    } else {
      super.onPaste(e);
    }
  }
}

export default CustomClipboard;
