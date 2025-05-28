import "./login.css";
import api from '../utils/api';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const cardRef = useRef(null);
    const loginButtonRef = useRef(null);
    const cadastroButtonRef = useRef(null);

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [cadastroErrorMessage, setCadastroErrorMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/user");
        }

        // Configura animação do card
        const card = cardRef.current;
        const loginButton = loginButtonRef.current;
        const cadastroButton = cadastroButtonRef.current;

        loginButton.onclick = () => {
            card.classList.remove("cadastroActive");
            card.classList.add("loginActive");
        };

        cadastroButton.onclick = () => {
            card.classList.remove("loginActive");
            card.classList.add("cadastroActive");
        };

        return () => {
            // Cleanup
            loginButton.onclick = null;
            cadastroButton.onclick = null;
        };
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (senha !== confirmarSenha) {
            setCadastroErrorMessage("As senhas não coincidem!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                username: nome,
                email: email,
                password: senha
            });

            if (response.data) {
                setIsOpen(true);
                setCadastroErrorMessage("");
                // Muda para a aba de login após cadastro
                cardRef.current.classList.remove("cadastroActive");
                cardRef.current.classList.add("loginActive");
                // Limpa os campos
                setNome("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
            }
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            if (error.response) {
                // Trata erros específicos do backend
                if (error.response.status === 409) {
                    setCadastroErrorMessage("Email ou nome de usuário já cadastrado!");
                } else {
                    setCadastroErrorMessage("Erro ao registrar usuário");
                }
            } else {
                setCadastroErrorMessage("Erro ao conectar com o servidor");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await api.post('/auth/login', {
                email: email,
                password: senha
            });

            const { token, user } = response.data;
            
            // Armazena os dados do usuário
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('user_id', user._id);
            localStorage.setItem('nome', user.username);

            // Redireciona para a página do usuário
            navigate('/user');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setErrorMessage("Credenciais inválidas!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="conteinerPai">
            <div className="card loginActive" ref={cardRef}>
                <div className="esquerda">
                    <div className="formLogin">
                        <h2>Fazer Login</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Carregando...' : 'Entrar'}
                            </button>
                            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
                        </form>
                    </div>
                    <div className="facaLogin">
                        <h2>Já tem <br />uma conta?</h2>
                        <p>Faça o Login!</p>
                        <button className="loginButton" ref={loginButtonRef}>Faça Login</button>
                    </div>
                </div>
                <div className="direita">
                    <div className="formCadastro">
                        <h2>Cadastro</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                minLength="3"
                            />
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                minLength="6"
                            />
                            <input
                                type="password"
                                placeholder="Confirme a sua senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Registrando...' : 'Cadastrar'}
                            </button>
                            {cadastroErrorMessage && (
                                <div className="errorMessage">{cadastroErrorMessage}</div>
                            )}
                            {isOpen && (
                                <div className="registerComplete">
                                    Conta criada com sucesso! Faça login.
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="facaCadastro">
                        <h2>Não tem <br />uma conta?</h2>
                        <p>Crie agora!</p>
                        <button className="cadastroButton" ref={cadastroButtonRef}>Cadastra-se</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;