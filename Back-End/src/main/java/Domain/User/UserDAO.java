package Domain.User;

import Entities.User;

public class UserDAO {
    private String name;
    private String familyName;
    private String email;
    private String password;
    private String phoneNumber;
    private float credit;

    public UserDAO() {
    }

    public UserDAO(User user) {
        this.name = user.getName();
        this.familyName = user.getFamilyName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.phoneNumber = user.getPhoneNumber();
        this.credit = user.getCredit();
    }

    public User getUserForm() {
        return new User(name, familyName, email, password, phoneNumber, credit);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public float getCredit() {
        return credit;
    }

    public void setCredit(float credit) {
        this.credit = credit;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
