package Services.Utilities;

import java.util.ArrayList;

public class ArrayListResponse<T> {
    private final ArrayList<T> list;
    private ResponseMessage responseMessage;

    public ArrayListResponse(ArrayList<T> list) {
        this.list = list;
    }

    public ArrayListResponse(ArrayList<T> list, ResponseMessage responseMessage) {
        this.list = list;
        this.responseMessage = responseMessage;
    }
}
