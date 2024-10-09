// File: components/withAuthAndOwnership.js

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuthAndOwnership = (WrappedComponent, resourceType) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
      if (status === "loading") return;
      
      if (!session) {
        router.replace("/api/auth/signin");
        return;
      }

      const checkOwnership = async () => {
        // This is a simplified example. You'd need to implement the actual API call.
        const res = await fetch(`/api/middlewares/ownership/${resourceType}/${router.query.id}`);
        const data = await res.json();
        
        if (data.userId === session.user.id) {
          setIsOwner(true);
        } else {
          router.replace("/unauthorized");
        }
      };

      checkOwnership();
    }, [session, status, router.query]);

    if (status === "loading" || !isOwner) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthAndOwnership;