const emailInput = document.getElementById('emailInput');
const sendBtn = document.getElementById('sendBtn');
const msg = document.getElementById('msg');
const signupBtn = document.getElementById('signupBtn');
const emailField = document.getElementById('email');
const logoutBtn = document.getElementById('logoutBtn');


if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    msg.textContent = "";

    if (!email) {
      msg.style.color = "red";
      msg.textContent = "Please enter a valid email.";
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/otp/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("OTP Response:", data);

      if (res.ok) {
        msg.style.color = "green";
        msg.textContent = data.message;

        
        localStorage.setItem("otpEmail", email);

        setTimeout(() => {
          if (data.existingUser) {
            window.location.href = 'login.html'; 
          } else {
            window.location.href = 'signup.html'; 
          }
        }, 1000);
      } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Failed to send OTP.";
      }
    } catch (err) {
      console.error("OTP error:", err);
      msg.style.color = "red";
      msg.textContent = "Error sending OTP.";
    }
  });
}

if (signupBtn) {

  const savedEmail = localStorage.getItem("otpEmail");
  if (savedEmail) {
    emailField.value = savedEmail;
  }

  signupBtn.addEventListener('click', async () => {
    const id = document.getElementById('id').value.trim();
    const Name = document.getElementById('name').value.trim();
    const email = emailField.value.trim();
    const mobileNumber = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value.trim();
    const otp = document.getElementById('otp').value.trim();
    const message = document.getElementById('message');

    if (!id || !Name || !email || !mobileNumber || !password || !otp) {
      message.style.color = 'red';
      message.textContent = 'Please fill all fields.';
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/user/signUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, Name, email, mobileNumber, password, otp })
      });

      const data = await res.json();
      console.log("SignUp response:", data);

      if (res.ok) {
        message.style.color = 'green';
        message.textContent = data.message;

        
        localStorage.removeItem("otpEmail");

       
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        message.style.color = 'red';
        message.textContent = data.message || "Signup failed.";
      }
    } catch (err) {
      console.error("Signup error:", err);
      message.style.color = 'red';
      message.textContent = "Something went wrong.";
    }
  });
}


const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginMessage = document.getElementById("loginMessage");

    if (!email || !password) {
      loginMessage.style.color = "red";
      loginMessage.textContent = "Please enter both email and password.";
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
       
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user?.Name || "");
        localStorage.setItem("role", data.user?.role || "");

        loginMessage.style.color = "green";
        loginMessage.textContent = "Login successful!";

        
        const role = data.user?.role;
        if (role === "manager") {
          window.location.href = "managerDashboard.html";
        } else if (role === "admin") {
          window.location.href = "adminDashboard.html";
        } else {
          window.location.href = "welcomePage.html";
        }
      } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = data.message || "Login failed.";
      }
    } catch (err) {
      console.error("Login Error:", err);
      loginMessage.style.color = "red";
      loginMessage.textContent = "Something went wrong.";
    }
  });
}


window.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("adminTableBody");

 
  if (!tableBody) return;

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/manager/getAllAdmins", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      tableBody.innerHTML = "";

      data.admins.forEach((admin) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${admin.id}</td>
          <td>${admin.Name}</td>
          <td>${admin.email}</td>
          <td>${admin.mobileNumber}</td>
          <td>${admin.createdBy || '-'}</td>
            <td>${admin.createdAt ? new Date(admin.createdAt).toLocaleString() : '_'}</td>
            <td>${admin.updatedBy || '_'}</td>
            <td>${admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : '_'}</td>
          <td>
            <button class="edit-btn" onclick="editAdmin('${admin._id}')">Edit</button>
            <button class="delete-btn" onclick="deleteAdmin('${admin._id}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      console.error("Failed to fetch admins:", data.message);
      alert(data.message || "Failed to load admins.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Something went wrong.");
  }
});



const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', async () => {
    const email = document.getElementById('resetEmail').value.trim();
    const otp = document.getElementById('resetOtp').value.trim();
    const newPassword = document.getElementById('resetNewPassword').value.trim();
    const message = document.getElementById('resetMessage');

    if (!email || !otp || !newPassword) {
      message.style.color = 'red';
      message.textContent = "All fields are required.";
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/user/resetPassword", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        message.style.color = 'green';
        message.textContent = data.message;

        
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        message.style.color = 'red';
        message.textContent = data.message || "Reset failed";
      }
    } catch (err) {
      console.error("Reset error:", err);
      message.style.color = 'red';
      message.textContent = "Something went wrong.";
    }
  });
}

window.onload = () => {
  const userName = localStorage.getItem("userName");
  const welcomeEl = document.getElementById("welcomeMessage");

  if (userName) {
    welcomeEl.textContent = `Welcome, ${userName}!`;
  } else {
    welcomeEl.textContent = "Welcome!";
  }
};

const logoutMessageEl = document.getElementById('logoutMessage');
const urlParams = new URLSearchParams(window.location.search);
const logoutMsg = urlParams.get('message');
if (logoutMessageEl && logoutMsg) {
  logoutMessageEl.textContent = logoutMsg;
}


if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    const name = localStorage.getItem("userName") || "User";

    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");

    window.location.href = `login.html?message=Logged out successfully, ${name}`;
  });
}



//manager

window.onload = async () => {
  const token = localStorage.getItem("token");
  const currentPath = window.location.pathname;

    if (currentPath.includes("managerDashboard.html")) {
    try {
      const res = await fetch("http://localhost:8000/api/manager/getAllAdmins", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Manager - Admin List:", data);

      const tbody = document.getElementById("adminTableBody");
      tbody.innerHTML = "";

      if (data.admins && data.admins.length > 0) {
        data.admins.forEach((admin) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${admin.id}</td>
            <td>${admin.Name || admin.name || ""}</td>
            <td>${admin.email}</td>
            <td>${admin.mobileNumber}</td>
            <td>${admin.createdBy || '-'}</td>
            <td>${admin.createdAt ? new Date(admin.createdAt).toLocaleString() : '_'}</td>
            <td>${admin.updatedBy || '_'}</td>
            <td>${admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : '_'}</td>
            <td>
              <button class="edit-btn" onclick="editAdmin('${admin.id}')">Edit</button>
              <button class="delete-btn" onclick="deleteAdmin('${admin.id}')">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="5">No admins found</td></tr>`;
      }
    } catch (error) {
      console.error("Manager - Error fetching admins:", error);
      alert("Failed to load admin list");
    }
  }
};



window.editAdmin = (id) => {
  localStorage.setItem("editAdminId", id);
  window.location.href = "editAdmin.html";
};


window.deleteAdmin = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this admin?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/api/manager/deleteAdmin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    alert(data.message);

   
    window.location.reload();
  } catch (error) {
    console.error("Error deleting admin:", error);
    alert("Failed to delete admin");
  }
};

//createAdmin by manager

const createAdminBtn = document.getElementById('createAdminBtn');

if (createAdminBtn) {
  createAdminBtn.addEventListener('click', async () => {
    const id = document.getElementById('adminId').value.trim();
    const Name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const mobileNumber = document.getElementById('adminMobile').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const message = document.getElementById('adminCreateMsg');

    if (!id || !Name || !email || !mobileNumber || !password) {
      message.style.color = 'red';
      message.textContent = "Please fill all fields.";
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
        return;
      }

      const res = await fetch("http://localhost:8000/api/manager/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, Name, email, mobileNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        message.style.color = 'green';
        message.textContent = data.message || "Admin created successfully!";
        setTimeout(() => {
          window.location.href = "managerDashboard.html";
        }, 1500);
      } else {
        message.style.color = 'red';
        message.textContent = data.message || "Creation failed.";
      }
    } catch (err) {
      console.error("Create Admin Error:", err);
      message.style.color = 'red';
      message.textContent = "Something went wrong.";
    }
  });
}


window.onload = () => {
  document.getElementById("editAdminId").value = localStorage.getItem("editAdminId") || "";
  document.getElementById("editAdminName").value = localStorage.getItem("editAdminName") || "";
  document.getElementById("editAdminEmail").value = localStorage.getItem("editAdminEmail") || "";
  document.getElementById("editAdminMobile").value = localStorage.getItem("editAdminMobile") || "";
};

const updateBtn = document.getElementById("editAdminBtn");

if (updateBtn) {
  updateBtn.addEventListener("click", async () => {
    
    const id = document.getElementById("editAdminId").value.trim(); 
    const Name = document.getElementById("editAdminName").value.trim();
    const email = document.getElementById("editAdminEmail").value.trim();
    const mobileNumber = document.getElementById("editAdminMobile").value.trim();
    const password = document.getElementById("editAdminPassword").value.trim();
    const msg = document.getElementById("editAdminMsg");

    if (!id || !Name || !email || !mobileNumber || !password) {
      msg.style.color = "red";
      msg.textContent = "Please fill all fields.";
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/manager/updateAdmin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Name, email, mobileNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        msg.style.color = "green";
        msg.textContent = "Admin updated successfully!";
        setTimeout(() => {
          window.location.href = "managerDashboard.html";
        }, 1500);
      } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Update failed.";
      }
    } catch (err) {
      console.error("Update Admin Error:", err);
      msg.style.color = "red";
      msg.textContent = "Something went wrong.";
    }
  });
}

function editAdmin(id, name, email, mobile) {
  localStorage.setItem("editAdminId", id);
  localStorage.setItem("editAdminName", name);
  localStorage.setItem("editAdminEmail", email);
  localStorage.setItem("editAdminMobile", mobile);

  window.location.href = "editAdmin.html";
}


//deleteAdmin by Manager
window.onload = () => {
  const adminName = localStorage.getItem("editAdminName");
  document.getElementById("adminName").textContent = adminName || "Unknown";
};

const deleteBtn = document.getElementById("deleteBtn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const adminId = localStorage.getItem("editAdminId"); 
    const adminName = localStorage.getItem("editAdminName");
    const msg = document.getElementById("deleteMsg");

    if (!adminId) {
      msg.style.color = "red";
      msg.textContent = "Admin ID not found.";
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${adminName}"?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/manager/deleteAdmin/${adminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        msg.style.color = "green";
        msg.textContent = `Admin "${adminName}" deleted successfully!`;
        setTimeout(() => {
          window.location.href = "managerDashboard.html";
        }, 2000);
      } else {
        msg.style.color = "red";
        msg.textContent = data.message || "Delete failed.";
      }
    } catch (err) {
      console.error("Delete Admin Error:", err);
      msg.style.color = "red";
      msg.textContent = "Something went wrong.";
    }
  });
}

function confirmDelete(adminId, adminName) {
  localStorage.setItem("editAdminId", adminId);
  localStorage.setItem("editAdminName", adminName);
  window.location.href = "deleteAdmin.html";
}



//welcome msg
window.addEventListener("DOMContentLoaded", () => {
  const welcomeEl = document.getElementById("welcomeMessage");
  const userName = localStorage.getItem("userName");

  if (welcomeEl && userName) {
    welcomeEl.textContent = `Welcome, ${userName}!`;
  }
});


//Admin Dashboard

window.onload = async () => {
  const token = localStorage.getItem("token");
  const currentPath = window.location.pathname;

  if (currentPath.includes("adminDashboard.html")) {
    try {
      const res = await fetch("http://localhost:8000/api/admin/getAllUsers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Admin - User List:", data);

      const table = document.getElementById("userTable");
      let tbody = table.querySelector("tbody");

      if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
      }

      tbody.innerHTML = ""; 

      if (data.users && data.users.length > 0) {
        data.users.forEach((user) => {
          console.log("Rendering user:", user);
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.Name || user.name || ""}</td>
            <td>${user.email}</td>
            <td>${user.mobileNumber}</td>
            <td>${user.createdBy || '-'}</td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
            <td>${user.updatedBy || '-'}</td>
            <td>${user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</td>
            <td>
              <button class="edit-btn" onclick="editUser('${user.id}')">Edit</button>
              <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

      } else {
        tbody.innerHTML = `<tr><td colspan="9">No users found</td></tr>`;
      }

    } catch (error) {
      console.error("User - Error fetching users:", error);
    }
  }
};

window.editUser = (id) => {
  const userRow = Array.from(document.querySelectorAll("#userTable tbody tr")).find(
    row => row.children[0].textContent === id
  );

  if (userRow) {
    localStorage.setItem("editUserId", id);
    localStorage.setItem("editUserName", userRow.children[1].textContent);
    localStorage.setItem("editUserEmail", userRow.children[2].textContent);
    localStorage.setItem("editUserMobile", userRow.children[3].textContent);
    window.location.href = "editUser.html";
  }
};


window.deleteUser = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this User?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/admin/deleteUser/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    const data = await res.json();
    alert(data.message);
    window.location.reload();

  } catch (error) {
    console.error("Error deleting User:", error);
    alert("Failed to delete user");
  }
};

// For editUser.html page
window.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editUserBtn");

  if (editBtn) {
    
    document.getElementById("editUserId").value = localStorage.getItem("editUserId") || "";
    document.getElementById("editUserName").value = localStorage.getItem("editUserName") || "";
    document.getElementById("editUserEmail").value = localStorage.getItem("editUserEmail") || "";
    document.getElementById("editUserMobile").value = localStorage.getItem("editUserMobile") || "";

   
    editBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      const id = document.getElementById("editUserId").value.trim();
      const Name = document.getElementById("editUserName").value.trim();
      const email = document.getElementById("editUserEmail").value.trim();
      const mobileNumber = document.getElementById("editUserMobile").value.trim();
      const password = document.getElementById("editUserPassword").value.trim();
      const msg = document.getElementById("editUserMsg");

      if (!id || !Name || !email || !mobileNumber || !password) {
        msg.style.color = "red";
        msg.textContent = "Please fill all fields.";
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/api/admin/updateUser/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Name, email, mobileNumber, password }),
        });

        const data = await res.json();
        if (res.ok) {
          msg.style.color = "green";
          msg.textContent = "User updated successfully";
          setTimeout(() => {
            window.location.href = "adminDashboard.html";
          }, 1500);
        } else {
          msg.style.color = "red";
          msg.textContent = data.message || "Update failed.";
        }

      } catch (err) {
        console.error("Update User Error:", err);
        msg.style.color = "red";
        msg.textContent = "Something went wrong.";
      }
    });
  }
});


function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
