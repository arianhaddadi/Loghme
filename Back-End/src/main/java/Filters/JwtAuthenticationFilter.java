package Filters;

import Utilities.Configs;
import Utilities.TokenProvider;
import org.springframework.util.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter implements Filter {

    public JwtAuthenticationFilter() {
    }

    @Override
    public void doFilter(
            ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        String path = httpServletRequest.getRequestURI();
        if (path.equals(Configs.SERVER_BASE_URL + "/login")
                || path.equals(Configs.SERVER_BASE_URL + "/signup")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }
        String jwt = resolveToken(httpServletRequest);
        if (StringUtils.hasText(jwt)) {
            if (TokenProvider.getInstance().validateToken(jwt)) {
                try {
                    String userEmail = TokenProvider.getInstance().getUserEmailFromToken(jwt);
                    httpServletRequest.setAttribute(Configs.USER_ID_ATTRIBUTE, userEmail);
                    filterChain.doFilter(servletRequest, servletResponse);
                } catch (Exception e) {
                    httpServletResponse.sendError(
                            HttpServletResponse.SC_UNAUTHORIZED, "JWT token is not valid!");
                }
            } else {
                httpServletResponse.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED, "JWT token is not valid!");
            }
        } else {
            httpServletResponse.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED, "You need to login to access this page!");
        }
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(TokenProvider.HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(TokenProvider.PREFIX)) {
            return bearerToken.replace(TokenProvider.PREFIX, "");
        }
        return null;
    }
}
