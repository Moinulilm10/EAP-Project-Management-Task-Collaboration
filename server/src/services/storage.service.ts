import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export class StorageService {
  private static bucketName = 'attachments';

  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'general'
  ): Promise<{ url: string; path: string }> {
    const uniqueFileName = `${uuidv4()}-${fileName.replace(/\s+/g, '_')}`;
    const filePath = `${folder}/${uniqueFileName}`;

    let { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error && error.message.toLowerCase().includes('bucket not found')) {
      // Attempt to create the bucket and retry
      const { error: createError } = await supabase.storage.createBucket(this.bucketName, {
        public: true,
        fileSizeLimit: 10485760 * 2, // 20MB buffer for the bucket limit
      });

      if (createError && !createError.message.toLowerCase().includes('already exists')) {
        throw new Error(`Failed to auto-create bucket: ${createError.message}`);
      }

      // Retry upload after bucket creation
      const retry = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });
        
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  }

  static async deleteFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete from Supabase: ${error.message}`);
    }
  }
}
