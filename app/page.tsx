"use client";

import { AnnouncementList } from "@/components/announcement/AnnouncementList";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`/api/announcement`);
      const data = await response.json();
      console.log("data", data);
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/announcement/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
        toast.success('Announcement deleted successfully');
      } else {
        console.error('Erreur lors de la suppression:', response.statusText);
        toast.error('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);   
      toast.error('Failed to delete announcement');
    }
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="w-full">
      <AnnouncementList announcements={announcements} onDelete={handleDelete} />
      <ToastContainer />
    </div>
  );
}
