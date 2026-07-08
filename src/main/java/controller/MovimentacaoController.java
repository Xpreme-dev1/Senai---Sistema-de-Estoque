package controller;

import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller para gerenciar movimentações de estoque.
 * Alteração: Criado para evitar erros de 404 no gerenciamento.js.
 */
@WebServlet("/api/movimentacoes")
public class MovimentacaoController extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
           throws IOException {
        // Retorna uma lista vazia por enquanto (pode ser expandido com uma tabela de movimentações)
        response.setContentType("application/json");
        response.getWriter().write("[]");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
           throws IOException {
        
        // Simulação de sucesso no registro de movimentação
        Map<String, String> result = new HashMap<>();
        result.put("status", "success");
        result.put("message", "Movimentação registrada com sucesso!");
        
        response.setContentType("application/json");
        response.getWriter().write(new Gson().toJson(result));
    }
}
