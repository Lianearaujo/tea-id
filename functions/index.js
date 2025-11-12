const express = require("express");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const cors = require("cors");

// Carrega a chave da conta de serviço que você baixou do Firebase
const serviceAccount = require("./serviceAccountKey.json");

// Inicializa o Admin SDK do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

// Configuração de Middlewares
// *** CORREÇÃO: A porta do CORS foi atualizada para 5174 ***
app.use(cors({ origin: 'http://localhost:5176', credentials: true }));
app.use(express.json());
app.use(cookieParser());

/**
 * Cria um cookie de sessão após o login do usuário no front-end.
 */
app.post("/sessionLogin", async (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dias em milissegundos

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' };
    
    res.cookie("session", sessionCookie, options);
    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Erro ao criar o cookie de sessão:", error);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
});

/**
 * Limpa o cookie de sessão para fazer logout.
 */
app.post("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.status(200).json({ status: "success" });
});

/**
 * Verifica o status da sessão do usuário e retorna os dados completos do perfil.
 */
app.get("/session-status", async (req, res) => {
    const sessionCookie = req.cookies.session || "";

    if (!sessionCookie) {
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
        const userDoc = await db.collection('users').doc(decodedClaims.email).get();
        
        if (!userDoc.exists) {
            console.warn(`Usuário com UID ${decodedClaims.uid} existe na autenticação mas não no Firestore.`);
            return res.status(200).json({ isAuthenticated: false });
        }
        
        const user = { 
          id: decodedClaims.uid, 
          ...userDoc.data(),
          profileType: decodedClaims.profileType || (decodedClaims.claims && decodedClaims.claims.profileType)
        };

        return res.status(200).json({ isAuthenticated: true, user: user });

    } catch (error) {
        // *** CORREÇÃO: Log de erro melhorado para mostrar o erro completo ***
        console.error("Falha detalhada ao verificar o cookie de sessão:", error);
        return res.status(200).json({ isAuthenticated: false });
    }
});


const port = process.env.PORT || 5178;
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
