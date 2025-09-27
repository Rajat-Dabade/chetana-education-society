import slugify from 'slugify';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const createSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
};

export const sanitizeHtml = (html: string): string => {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel']
  });
};

export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${random}.${extension}`;
};

export const validateFileType = (mimetype: string): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  return allowedTypes.includes(mimetype);
};

export const formatError = (message: string, code: string = 'VALIDATION_ERROR') => {
  return {
    error: {
      message,
      code
    }
  };
};

export const formatValidationErrors = (errors: unknown[]) => {
  return {
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors
    }
  };
};
