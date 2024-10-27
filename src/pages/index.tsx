import { FormEventHandler, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | undefined>(undefined);

  const uploadToUrl = async (url: string) => {
    if (file) {
      const data = await file.arrayBuffer();
      console.log(btoa(String.fromCharCode(...new Uint8Array(data))));
    }

    fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "content-md5": "vhJTkFLoyrTFYektgbAK6A==",
      },
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    if (file) {
      fetch("/api/get-upload-url", {
        method: "POST",
        body: JSON.stringify({ filename: file.name }),
        headers: {
          "content-type": "application/json",
        },
      }).then(async (res) => {
        const { uploadUrl } = (await res.json()) as { uploadUrl: string };
        uploadToUrl(uploadUrl);
      });
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        minHeight: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <label>Select file:</label>
      <input onChange={(e) => setFile(e.target.files?.[0])} type="file" />
      <button>Submit</button>
    </form>
  );
}
