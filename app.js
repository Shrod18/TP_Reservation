document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const addButton = document.getElementById("add");
    const initialSelect = document.querySelector(".date");
    const maxReservations = 5;
    let reservationCount = 1;

    let datesToDisplay = [
        {value:"2024-01-06"},
        {value:"2024-01-13"},
        {value:"2024-01-20"},
        {value:"2024-01-27"},
    ];

    function updateAddButton() {
        addButton.classList.toggle("disabled", reservationCount >= maxReservations);
    }

    function getAvailableDates() {
        const selectedDates = new Set(
            Array.from(document.querySelectorAll(".date")).map(select => select.value)
        );
        return datesToDisplay.filter(date => !selectedDates.has(date.value));
    }

    function updateDateOptions() {
        document.querySelectorAll(".date").forEach(select => {
            const currentValue = select.value;
            const availableDates = getAvailableDates().concat(
                currentValue ? [{ value: currentValue }] : []
            );
            select.innerHTML = availableDates
                .map(date => `<option value="${date.value}" ${date.value === currentValue ? 'selected' : ''}>${date.value}</option>`)
                .join('');
        });
    }

    function createReservationBlock() {
        reservationCount++;
        updateAddButton();
        
        const fieldset = document.createElement("fieldset");
        fieldset.classList.add("fieldset");
        
        let availableDates = getAvailableDates();
        
        fieldset.innerHTML = `
            <legend>Réservation</legend>
            <div class="form-group row">
                <div class="col-sm-4"><label>Date :</label></div>
                <div class="col-sm-8">
                    <select class="date form-control">
                        ${availableDates.map(date => `<option value="${date.value}">${date.value}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-4">
                    <label>Nombre de places :</label>
                </div>
                <div class="col-sm-8">
                    <input type="number" class="quantite form-control" value="1" min="1" required/>
                </div>
            </div>
            <button type="button" class="btn btn-danger remove">Supprimer</button>
        `;

        fieldset.querySelector(".remove").addEventListener("click", function () {
            if (confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
                fieldset.remove();
                reservationCount--;
                updateAddButton();
                updateDateOptions();
            }
        });

        fieldset.querySelector(".date").addEventListener("change", updateDateOptions);

        form.insertBefore(fieldset, addButton);
        updateDateOptions();
    }

    addButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (!addButton.classList.contains("disabled")) {
            createReservationBlock();
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        let valid = true;
        const reservations = [];
        
        document.querySelectorAll(".fieldset").forEach(fieldset => {
            const date = fieldset.querySelector(".date").value;
            const nom = fieldset.querySelector(".nom").value.trim();
            const quantite = parseInt(fieldset.querySelector(".quantite").value, 10);
            
            if (!nom || quantite < 1) {
                valid = false;
                alert("Veuillez remplir correctement tous les champs.");
                return;
            }
            
            reservations.push({ date, nom, quantite });
        });
        
        if (valid) {
            localStorage.setItem("reservations", JSON.stringify(reservations));
            console.log("Réservations enregistrées :", reservations);
            alert("Réservations enregistrées avec succès !");
        }
    });

    updateAddButton();
    updateDateOptions();
    
    // Remplir le premier select initial
    initialSelect.innerHTML = datesToDisplay.map(date => `<option value="${date.value}">${date.value}</option>`).join('');
});