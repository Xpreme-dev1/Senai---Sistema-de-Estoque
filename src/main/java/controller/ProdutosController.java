package controller;

import com.google.gson.Gson;
import dao.CadastroProdutosDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import model.CadastroProdutoModel;

/**
 * Controller para fornecer a lista de produtos para a tela de Gerenciamento.
 * Alteração: Criado para atender a chamada fetch('/api/produtos') do gerenciamento.js.
 */
@WebServlet("/api/produtos")
public class ProdutosController extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
           throws IOException {
        
        CadastroProdutosDAO dao = new CadastroProdutosDAO();
        // Busca todos os produtos sem filtro
        List<CadastroProdutoModel> lista = dao.listarComFiltro(null, null, null);
        
        String json = new Gson().toJson(lista);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
