import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../utils/api';
import "./new_gym.css";

function New_gym() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Estado do formulário
    const [form, setForm] = useState({
        name: "",
        address: "",
        open_time: "",
        email_address: "",
        phone: ""
    });

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        document.body.classList.toggle("open");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user) {
            setError("Usuário não autenticado");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/api/gym', {
                ...form,
                user_responsible: user._id
            });

            if (response.data) {
                alert("Academia adicionada com sucesso!");
                navigate("/user");
            }
        } catch (error) {
            console.error('Erro ao adicionar academia:', error);
            setError(error.response?.data?.error || "Erro ao adicionar academia");
        } finally {
            setIsLoading(false);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^[0-9]{10,11}$/;
        return re.test(phone);
    };

    const validateForm = () => {
        if (form.name.length < 3) return "Nome deve ter pelo menos 3 caracteres";
        if (form.address.length < 5) return "Endereço muito curto";
        if (!validateEmail(form.email_address)) return "Email inválido";
        if (!validatePhone(form.phone)) return "Telefone inválido (use apenas números)";
        return null;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        
        if (validationError) {
            setError(validationError);
            return;
        }

        await handleSubmit(e);
    };

    return (
        <div className="app">
            {/* Barra de topo com o logotipo */}
            <div className="barra-menu">
                <div className="logo">
                    <img 
                        src="/img/tec_fit-removebg-preview.png" 
                        width="120" 
                        alt="Tec Fit Logo" 
                    />
                </div>
            </div>

            {/* Botão para abrir/fechar o menu */}
            <button className="Tec" onClick={toggleMenu}>
                <span className="Tec-icon"></span>
            </button>

            {/* Menu lateral com links de navegação */}
            <div className={`menu ${menuOpen ? "active" : ""}`}>
                <nav>
                    <a href="/" style={{ animationDelay: "0.2s" }}>
                        <h6>Inicio</h6>
                    </a>
                    <a href="/sobre" style={{ animationDelay: "0.4s" }}>
                        <h6>Sobre</h6>
                    </a>
                    <a href="/user" style={{ animationDelay: "0.6s" }}>
                        <h6>Usuário</h6>
                    </a>
                </nav>
            </div>

            {/* Seção "Adicionar Academia" */}
            <div className="new-gym-container">
                <h2>Adicionar Academia</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Nome*</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            minLength="3"
                            placeholder="Nome da academia"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Endereço*</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            minLength="5"
                            placeholder="Endereço completo"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Horário de Funcionamento*</label>
                        <input
                            type="text"
                            name="open_time"
                            value={form.open_time}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Seg-Sex 6h-22h, Sáb 8h-14h"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>E-mail*</label>
                        <input
                            type="email"
                            name="email_address"
                            value={form.email_address}
                            onChange={handleChange}
                            required
                            placeholder="email@academia.com"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Telefone*</label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10,11}"
                            placeholder="11999999999"
                            title="Digite apenas números (10 ou 11 dígitos)"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? 'Salvando...' : 'Adicionar Academia'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default New_gym;