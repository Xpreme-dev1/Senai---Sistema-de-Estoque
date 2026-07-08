package controller;

import com.google.gson.Gson;
import dao.CadastroProdutosDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import model.CadastroProdutoModel;

@WebServlet("/api/produtos/reposicao")
public class ReposicaoController extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
           throws IOException {
        
        CadastroProdutosDAO dao = new CadastroProdutosDAO();
        List<CadastroProdutoModel> lista = dao.listarComFiltro(null, null, null);
        
        // Filtra apenas produtos onde a quantidade é menor ou igual ao estoque mínimo
        List<CadastroProdutoModel> reposicao = lista.stream()
            .filter(p -> p.getQuantidade() <= p.getEstoqueMinimo())
            .collect(Collectors.toList());
        
        String json = new Gson().toJson(reposicao);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
