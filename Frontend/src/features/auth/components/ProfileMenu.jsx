import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

const ProfileMenu = () => {
  const { user, handleLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const displayName = user?.username || user?.email || "Profile";
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch {
      setOpen(false);
    }
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span className="profile-menu__avatar">{initials}</span>
        <span className="profile-menu__identity">
          <span className="profile-menu__name">{displayName}</span>
          {user?.email && <span className="profile-menu__email">{user.email}</span>}
        </span>
        <span className={`profile-menu__chevron ${open ? "profile-menu__chevron--open" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="profile-menu__dropdown" role="menu">
          <div className="profile-menu__summary">
            <strong>{displayName}</strong>
            {user?.email && <span>{user.email}</span>}
          </div>
          <button
            type="button"
            className="profile-menu__item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/plans");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            My Interview Plans
          </button>
          <button type="button" className="profile-menu__item" role="menuitem" onClick={handleLogoutClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
