import "./user.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaShareAlt, FaEdit, FaTrash } from "react-icons/fa";
import api from '../utils/api';

// Popup de edição de academia
function EditGymPopup({ academia, onClose, onSave }) {
    const [form, setForm] = useState({
        name: academia.name || "",
        address: academia.address || "",
        open_time: academia.open_time || "",
        email_address: academia.email_address || "",
        phone: academia.phone || ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const response = await api.put(`/api/gym/${academia._id}`, form);
            onSave(response.data.gym);
            onClose();
        } catch (error) {
            setError(error.response?.data?.error || "Erro ao atualizar academia");
            console.error('Erro ao atualizar academia:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>Editar Academia</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="edit-gym-form">
                    <div>
                        <label>Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            minLength="3"
                        />
                    </div>
                    <div>
                        <label>Endereço</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Horário de Funcionamento</label>
                        <input
                            type="text"
                            name="open_time"
                            value={form.open_time}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email_address"
                            value={form.email_address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Telefone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </form>
            </div>
            <style>{`
                .popup-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .popup-content {
                    background: #918e8e;
                    padding: 32px 24px 24px 24px;
                    border-radius: 8px;
                    min-width: 320px;
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    top: -1rem;
                    left: 16rem;
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                }
                .error-message {
                    color: #ff3333;
                    margin-bottom: 12px;
                    text-align: center;
                }
                .edit-gym-form div {
                    margin-bottom: 12px;
                }
                .edit-gym-form label {
                    color: #fff;
                    display: block;
                    margin-bottom: 4px;
                }
                .edit-gym-form input {
                    color: #000000;
                    width: 100%;
                    padding: 6px 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .edit-gym-form button[type="submit"] {
                    margin-top: 8px;
                    padding: 8px 16px;
                    background: #2ecc71;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .edit-gym-form button[type="submit"]:disabled {
                    background: #cccccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

function User() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [nome, setNome] = useState("");
    const [academias, setAcademias] = useState([]);
    const [editAcademia, setEditAcademia] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !userData) {
            navigate("/login");
            return;
        }

        setNome(userData.username || "Usuário");
        fetchGyms();
    }, [navigate]);

    const fetchGyms = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await api.get('/api/gym');
            setAcademias(response.data);
        } catch (error) {
            setError("Erro ao carregar academias");
            console.error("Erro ao buscar academias:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        document.body.classList.toggle("open");
    };

    const handleAddGym = () => {
        navigate("/new_gym");
    };

    const handleEditGym = (academia) => {
        setEditAcademia(academia);
    };

    const handleSaveEdit = (updatedAcademia) => {
        setAcademias(academias.map(a => a._id === updatedAcademia._id ? updatedAcademia : a));
    };

    const handleDeleteGym = async (gymId) => {
        if (!window.confirm("Tem certeza que deseja excluir esta academia?")) {
            return;
        }

        try {
            await api.delete(`/api/gym/${gymId}`);
            setAcademias(academias.filter(a => a._id !== gymId));
        } catch (error) {
            alert(error.response?.data?.error || "Erro ao excluir academia");
            console.error("Erro ao deletar academia:", error);
        }
    };

    return (
        <div className="app">
            <div className="barra-menu">
                <div className="logo">
                    <img src="/img/tec_fit-removebg-preview.png" width="120" alt="Tec Fit Logo" />
                </div>
            </div>

            <button className="Tec" onClick={toggleMenu}>
                <span className="Tec-icon"></span>
            </button>

<div className={`menu${menuOpen ? " active" : ""}`}>
                <nav>
                    <a href="/" style={{ animationDelay: "0.2s" }}>
                        <h6>Inicio</h6>
                    </a>
                    <a href="/favorite" style={{ animationDelay: "0.4s" }}>
                        <h6>Favorito</h6>
                    </a>
                    <a href="/contato" style={{ animationDelay: "0.6s" }}>
                        <h6>Contato</h6>
                    </a>
                    <a href="/logout" style={{ animationDelay: "0.8s" }}>
                        <h6>Sair</h6>
                    </a>
                </nav>
            </div>

            <div className="profile-page">
                <div className="profile-sidebar">
                    <img
                        className="profile-pic"
                        src="/img/renato.cariani.jpg"
                        alt="Profile"
                    />
                    <div className="profile-header">
                        <h3>{nome}</h3>
                    </div>
                    <div className="stats">
                        <span><b>{academias.length}</b> Projetos</span>
                        <span><b>6k</b> Views</span>
                        <span><b>9</b> Pastas</span>
                    </div>
                    <button className="share-link">
                        <FaShareAlt /> Compartilhar link do perfil
                    </button>
                    <button className="follow-button">Seguir</button>

                    <div className="section">
                        <h3>Sobre</h3>
                    </div>
                    <div className="sobre-texto">
                        <p>Venha conhecer a nossa academia!</p>
                    </div>

                    <div className="section">
                        <h3>Experiencias</h3>
                        <div className="tags">
                            <span className="tag musculacao">Musculação</span>
                            <span className="tag danca">Prof Dança</span>
                            <span className="tag instrutor">Instrutor</span>
                            <span className="tag professor">Professor</span>
                        </div>
                    </div>

                    <div className="section">
                        <h3>Área</h3>
                        <span className="tag area">Personal Trainer</span>
                    </div>

                    <button className="contact-button">Contate-me</button>
                    <div className="socials">
                        <FaInstagram />
                        <FaLinkedin />
                    </div>
                </div>

                <div className="profile-main">
                    <h3>
                        <span className="active">ADICIONE SUA ACADEMIA AQUI</span>
                    </h3>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    {isLoading ? (
                        <div className="loading">Carregando academias...</div>
                    ) : (
                        <div className="project-gallery">
                            {academias.length === 0 ? (
                                <div className="no-gyms">
                                    <p>Você ainda não possui academias cadastradas</p>
                                </div>
                            ) : (
                                academias.map((academia) => (
                                    <div className="project-card" key={academia._id}>
                                        <img src={academia.imagem || "/img/acad3.jpg"} alt={academia.name} />
                                        <div className="project-info">
                                            <span>{academia.name}</span>
                                            <span className="action-icons">
                                                <FaEdit
                                                    className="edit-icon"
                                                    title="Editar academia"
                                                    onClick={() => handleEditGym(academia)}
                                                />
                                                <FaTrash
                                                    className="delete-icon"
                                                    title="Deletar academia"
                                                    onClick={() => handleDeleteGym(academia._id)}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <button className="add-project" onClick={handleAddGym}>
                                + Add Academia
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {editAcademia && (
                <EditGymPopup
                    academia={editAcademia}
                    onClose={() => setEditAcademia(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}

export default User;