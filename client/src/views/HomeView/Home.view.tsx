import { useNavigate } from "react-router-dom"

export const HomeView = () => {
    const navigate = useNavigate();
    
    return <div>
        <h1>Home View</h1>
        <button onClick={()=>navigate('/intro')}>Go to Intro</button>
    </div>
}