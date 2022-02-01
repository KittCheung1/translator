import '../../css/Translator.css';
import { useContext, useState } from "react";
import { WordsContext } from "../../contexts/WordsContext";
import { pictures } from '../../images.js';
import withAuth from '../../hoc/withAuth';
import { pushTranslation } from '../../api/user';
import { useUser } from '../../contexts/UserContext';
import { saveStorage } from '../../utils/storage';
import { STORAGE_KEY_USER } from '../../consts/storage';
import { useNavigate } from "react-router-dom";

function Translator() {

    const { user, setUser } = useUser();
    const [text, setText] = useState("")
    const [wordlist, setWord] = useContext(WordsContext)
    const [hasClick, setClick] = useState(false);
    const [images, setImages] = useState([])
    const navigate = useNavigate();

// Stores the value of the input text
    const handleOnChange = (event) => {
        setText(event.target.value)
        setWord(event.target.value)
        setClick(false)
    }
// Initiate functionality on button click
    const onBtnClick = () => {
        setClick(true)
        translate()
        setText("");
    }
// Navigate to profilepage
    const profilePage = () => {
        navigate("/profile")
    }
//When the button is clicked it calls on this method to fetch the user-input to be translated 
//we set the input to lowercase and split it up in order to match the characters with the pictures
//Inside the for-loop we get the position in the alphabet and then we supply the matching image for that character
    const translate = async () => {
        setImages([]);

        let arr = wordlist.toLowerCase().split('');
        const [error, updatedUser] = await pushTranslation(user, wordlist);
        if (error !== null) {
            return;
        }
        saveStorage(STORAGE_KEY_USER, updatedUser);
        setUser(updatedUser);

        const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        for (let index = 0; index < arr.length; index++) {

            let position = alphabet.indexOf(arr[index]);

            setImages(images => {
                return [...images, {
                    id: images.length,
                    value: pictures[position]
                }]
            });
        }
    }

    return (
        <div className="Translator">
            <h1> My Translator </h1>
            <div id="box">
                <fieldset >
                    <legend>What do you want to translate? </legend>
                    <div>
                        <br></br>
                        <input className="TransInput" type="text" value={text} onChange={handleOnChange} placeholder="Text to translate" ></input>
                        <br></br>
                        {hasClick && <p>{wordlist}</p>}
                        <div className="btn-div">
                        <button id="btn" onClick={onBtnClick}>Translate</button>
                        <button id="btn" onClick={profilePage}>Profile page</button>

                        </div>

                        <br></br>
                        <br></br>
                        <div id="divBox">
                            {hasClick &&
                                <ul >
                                    {
                                        images.map(image => {
                                            return <img key={image.id} src={image.value} alt="" id="sign" ></img>
                                        })
                                    }
                                </ul>
                            }

                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default withAuth(Translator);