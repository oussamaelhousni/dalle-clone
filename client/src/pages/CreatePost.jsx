import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { FormField, Card, Loader } from "../components";
import { getRandomPrompt } from "../utils";
const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        prompt: "prompt",
        photo: "",
    });
    const [generatingImage, setGeneratingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const generateImage = () => {
        if (form.prompt) {
            setGeneratingImage(true);
            fetch("http://localhost:8080/api/v1/dalle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: form.prompt }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("the data", data);
                    setForm({
                        ...form,
                        photo: `data:image/jpeg;base64,${data.photo}`,
                    });
                })
                .catch((err) => alert(err))
                .finally(() => {
                    setGeneratingImage(false);
                });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.photo) {
            setLoading(true);
            fetch("http://localhost:8080/api/v1/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            })
                .then((res) => res.json())
                .then((data) => console.log(data))
                .catch((err) => {
                    alert(err);
                    console.log(err);
                })
                .finally(() => setLoading(false));
        }
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    };
    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">
                    Create
                </h1>
                <p className="mt-2 text-[#666e75] text-[#16px] max-w-[500px]">
                    Create imaginative and visually stunning image through
                    DALL-E AI and share them with the community
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-16 max-w-13xl">
                <FormField
                    labelName="Your name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    handleChange={handleChange}
                />

                <FormField
                    labelName="Prompt"
                    type="text"
                    name="prompt"
                    placeholder="a painting of a fox in the style of Starry Night"
                    value={form.prompt}
                    handleChange={handleChange}
                    isSurpriseMe
                    handleSurpriseMe={handleSurpriseMe}
                />
                <div className="relative bg-gray-50 border border-gray-50 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center m-auto sm:mx-0">
                    {form.photo ? (
                        <img
                            src={form.photo}
                            alt="prompt"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-9/12 h-9/12 object-contain opacity-40"
                        />
                    )}

                    {generatingImage && (
                        <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                            <Loader />
                        </div>
                    )}
                </div>

                <div className="mt-5 flex gap-5">
                    <button
                        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-cente"
                        onClick={generateImage}
                        type="button"
                    >
                        {generatingImage ? "Generating" : "Generate"}
                    </button>
                </div>

                <div className="my-5">
                    <p className="mt-2 text-[#666e75] text-[14px]">
                        Once you have created the image you want, you can share
                        it with others in the community
                    </p>
                    <button
                        type="submit"
                        className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        disabled={loading}
                    >
                        {loading ? "Sharing..." : "Share with the Community"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreatePost;
