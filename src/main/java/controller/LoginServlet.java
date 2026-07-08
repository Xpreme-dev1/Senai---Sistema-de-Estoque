package controller;

import dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import model.UserModel;

@WebServlet("/login")
public class LoginServlet extends HttpServlet{
    
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {
        
        String usuario = request.getParameter("users");
        String senha = request.getParameter("passw");
       
        
        UserModel UserModel = new UserModel();
        UserModel.setUsername(usuario);
        UserModel.setPassword(senha);
        
        
        
        UserDAO dao = new UserDAO();
        
        UserModel user = dao.validarLogin(UserModel);
        
        if(user != null) {
            HttpSession session =
                    request.getSession();
            
            session.setAttribute("usuario", user.getUsername());
            session.setAttribute("funcao", user.getFuncao());
            
            session.setAttribute("usuario", usuario);
            
            
            response.sendRedirect(request.getContextPath() + "/pages/dashboard.html");
        }else{
            response.sendRedirect(request.getContextPath() + "/index.html");
        }
    }
    
}
