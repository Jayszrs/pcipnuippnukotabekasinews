import { Cloudinary } from "@cloudinary/url-gen";
import { auth } from "@/integrations/firebase/client";

type CloudinarySignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  signature: string;
  timestamp: number;
};

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  resource_type: "image" | "video" | "raw";
};

const stripFileExtension = (value: string) => value.replace(/\.[^/.]+$/, "");

const buildPublicId = (path: string) =>
  stripFileExtension(path)
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) =>
      segment
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80),
    )
    .filter(Boolean)
    .join("/");

const buildFolder = (folder: string) => `ipnu-ippnu-bekasi/${folder}`.replace(/\/+/g, "/");

const getSignature = async (folder: string, publicId: string): Promise<CloudinarySignature> => {
  const token = await auth?.currentUser?.getIdToken();
  if (!token) throw new Error("Login ulang sebelum upload media.");

  const response = await fetch("/api/cloudinary-signature", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folder, publicId }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Gagal mengambil signature Cloudinary.");
  return result as CloudinarySignature;
};

const optimizeCloudinaryImage = (cloudName: string, publicId: string) => {
  const cld = new Cloudinary({ cloud: { cloudName } });
  return cld.image(publicId).format("auto").quality("auto").toURL();
};

export const uploadToCloudinary = async (folder: string, path: string, file: File) => {
  const publicId = buildPublicId(path) || `${Date.now()}`;
  const signature = await getSignature(buildFolder(folder), publicId);
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("public_id", signature.publicId);
  formData.append("overwrite", "true");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as CloudinaryUploadResult & { error?: { message?: string } };

  if (!response.ok) {
    throw new Error(result.error?.message || "Upload Cloudinary gagal.");
  }

  if (result.resource_type === "image") {
    return optimizeCloudinaryImage(signature.cloudName, result.public_id);
  }

  return result.secure_url;
};
