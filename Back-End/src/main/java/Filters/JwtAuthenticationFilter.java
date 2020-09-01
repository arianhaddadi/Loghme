package Filters;

import Utilities.TokenProvider;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends GenericFilterBean {

    public JwtAuthenticationFilter() {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException,
            ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;

        String path = httpServletRequest.getRequestURI();
        if ("/login".equals(path) || "/signup".equals(path)) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }
        String jwt = this.resolveToken(httpServletRequest);
        if (StringUtils.hasText(jwt)) {
            if (TokenProvider.getInstance().validateToken(jwt)) {
                try {
                    String userEmail = TokenProvider.getInstance().getUserEmailFromToken(jwt);
                    httpServletRequest.setAttribute("userEmail", userEmail);
                    filterChain.doFilter(servletRequest, servletResponse);
                }
                catch (Exception e) {
                    httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "JWT token is not valid!");
                }
            }
            else {
                httpServletResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "JWT token is not valid!");
            }
        }
        else {
            httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "You need to login to access this page!");
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
