import { Button } from "../components/Button";
import { ShareIcon } from "../icons/share";
import { PlusIcon } from "../icons/PlusIcon";
import { Card } from "../components/Card";
import "../App.css";
import { Sidebar } from "../components/SidebarComponent";
import { useState } from "react";
import { CreateContentModal } from "../components/CreateContentModel";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";
export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false); // ✅ consistent naming
 const {contents,refresh}=useContent();

  return (
    <div>
      <Sidebar />

      <div className="p-4 ml-72 min-h-screen">
 
        <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />

  
        <div className="flex gap-4 justify-end mb-6">
          <Button  onClick={async()=>{
          const response= await axios.post(`${BACKEND_URL}/api/v1/brain/share`,
              {share:true},{
                headers:{
                  "Authorization":localStorage.getItem("token")
                }
              }
            );
          const shareUrl= `http://localhost:5173/share/${response.data.hash}`;
          alert(shareUrl);
          }}variant="primary" text="Share Brain" startIcon={<ShareIcon />} />
          <Button
            onClick={() => setModalOpen(true)}
            variant="secondary"
            text="Add Content"
            startIcon={<PlusIcon />}
          />
        </div>

   
        <div className="flex gap-4 flex-wrap">
      
        {contents.map(({_id,type,link,title})=>(<Card
              key={_id}
              _id={_id}
              type={type}
              link={link}
              title={title}
              // onDelete={()=>handleDelete(_id)}
              />
            
          ))}
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
