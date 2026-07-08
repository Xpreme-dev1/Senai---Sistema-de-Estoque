package controller;

import jakarta.mail.Address;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.InetAddress;

@WebServlet("/api/perfil")
public class PerfilController extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);
        
        String perfil = (String) session.getAttribute("perfil");
        
        InetAddress addr = InetAddress.getLocalHost();
        
        String ip = addr.getHostAddress();
                
        response.setContentType("application/json");
        response.getWriter().write("{\"perfil\":\"" + perfil + ip + "\"}");
    }
    
}