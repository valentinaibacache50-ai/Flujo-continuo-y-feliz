import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (file: File, folder: string = "general"): Promise<string | null> => {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { error } = await supabase.storage.from("imagenes").upload(fileName, file);
  if (error) {
    console.error("Upload error:", error);
    return null;
  }
  
  const { data } = supabase.storage.from("imagenes").getPublicUrl(fileName);
  return data.publicUrl;
};
