		/* =============================================================
		   Serie A Admin - teams.js
		   Demo veri + filtre + sıralama + ekle/düzenle/sil.
		   API'ye geçişte yorumlardaki uç noktalar kullanılır.
		   ============================================================= */
		(function () {
			'use strict';

			const MAX_ACTIVE = 20;
			const REGION = { north: 'Kuzey İtalya', center: 'Orta İtalya', south: 'Güney İtalya', island: 'Adalar' };

			/* Demo kayıtlar (API: GET /api/admin/teams). Kapasite ve yıllar demo amaçlıdır. */
			let teams = [
				[1, 'Atalanta', 'ATA', 'Bergamo', 'north', 'Gewiss Stadium', 24950, 1907, '#1E6FB8', '#111111', 'active'],
				[2, 'Bologna', 'BOL', 'Bologna', 'north', "Stadio Renato Dall'Ara", 36462, 1909, '#1A2F5A', '#A21C26', 'active'],
				[3, 'Cagliari', 'CAG', 'Cagliari', 'island', 'Unipol Domus', 16416, 1920, '#A5162B', '#0E2A56', 'active'],
				[4, 'Como', 'COM', 'Como', 'north', 'Stadio Giuseppe Sinigaglia', 13602, 1907, '#0B3E91', '#FFFFFF', 'active'],
				[5, 'Fiorentina', 'FIO', 'Firenze', 'center', 'Stadio Artemio Franchi', 43147, 1926, '#5B2A86', '#FFFFFF', 'active'],
				[6, 'Frosinone', 'FRO', 'Frosinone', 'center', 'Stadio Benito Stirpe', 16227, 1928, '#1C4E9A', '#FFD200', 'active'],
				[7, 'Genoa', 'GEN', 'Genova', 'north', 'Stadio Luigi Ferraris', 36599, 1893, '#A2172E', '#002B5C', 'active'],
				[8, 'Inter', 'INT', 'Milano', 'north', 'San Siro', 75817, 1908, '#0A4FA8', '#101418', 'active'],
				[9, 'Juventus', 'JUV', 'Torino', 'north', 'Allianz Stadium', 41507, 1897, '#16181D', '#E8E8E8', 'active'],
				[10, 'Lazio', 'LAZ', 'Roma', 'center', 'Stadio Olimpico', 70634, 1900, '#8FD3F4', '#FFFFFF', 'active'],
				[11, 'Lecce', 'LEC', 'Lecce', 'south', 'Stadio Via del Mare', 31533, 1908, '#F6D000', '#D21F26', 'active'],
				[12, 'Milan', 'MIL', 'Milano', 'north', 'San Siro', 75817, 1899, '#C8141E', '#111111', 'active'],
				[13, 'Monza', 'MON', 'Monza', 'north', 'U-Power Stadium', 16917, 1912, '#D2122E', '#FFFFFF', 'active'],
				[14, 'Napoli', 'NAP', 'Napoli', 'south', 'Stadio Diego Armando Maradona', 54726, 1926, '#1E9BD7', '#0C3C78', 'active'],
				[15, 'Parma', 'PAR', 'Parma', 'north', 'Stadio Ennio Tardini', 22352, 1913, '#FFD200', '#1D3E8A', 'active'],
				[16, 'Roma', 'ROM', 'Roma', 'center', 'Stadio Olimpico', 70634, 1927, '#8E1F2F', '#F0B323', 'active'],
				[17, 'Sassuolo', 'SAS', 'Sassuolo', 'north', 'Mapei Stadium', 21584, 1920, '#00A651', '#111111', 'active'],
				[18, 'Torino', 'TOR', 'Torino', 'north', 'Stadio Olimpico Grande Torino', 27958, 1906, '#7E1B1B', '#E9D9B0', 'active'],
				[19, 'Udinese', 'UDI', 'Udine', 'north', 'Bluenergy Stadium', 25144, 1896, '#26282C', '#FFFFFF', 'active'],
				[20, 'Venezia', 'VEN', 'Venezia', 'north', 'Stadio Pier Luigi Penzo', 11150, 1907, '#141414', '#F06A1A', 'active'],
				[21, 'Sampdoria', 'SAM', 'Genova', 'north', 'Stadio Luigi Ferraris', 36599, 1946, '#1B4FA0', '#FFFFFF', 'inactive'],
				[22, 'Salernitana', 'SAL', 'Salerno', 'south', 'Stadio Arechi', 37180, 1919, '#7A1E2E', '#FFFFFF', 'inactive']
			].map(([id, name, code, city, region, stadium, capacity, founded, colorA, colorB, status]) =>
				({ id, name, code, city, region, stadium, capacity, founded, colorA, colorB, status }));

			/* ---------- Yardımcılar ---------- */
			const $ = (sel, root = document) => root.querySelector(sel);
			const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
			const norm = (s) => String(s).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			const num = (n) => new Intl.NumberFormat('tr-TR').format(n);
			const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
			const activeCount = () => teams.filter((t) => t.status === 'active').length;

			/* Arma yazısı: ana rengin açıklığına göre koyu/açık */
			function inkFor(hex) {
				const h = hex.replace('#', '');
				const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
				return (0.299 * r + 0.587 * g + 0.114 * b) > 170 ? '#10224A' : '#FFFFFF';
			}
			const crestStyle = (a, b) => `--crest-a:${a};--crest-b:${b};--crest-ink:${inkFor(a)}`;

			const els = {
				rows: $('[data-team-rows]'),
				count: $('[data-result-count]'),
				strip: $('[data-league-strip]'),
				filter: $('[data-filter-form]'),
				modal: $('#team-modal'),
				form: $('[data-team-form]'),
				title: $('#team-modal-title'),
				alert: $('[data-form-alert]'),
				del: $('#delete-modal'),
				delText: $('[data-delete-text]'),
				toasts: $('[data-toasts]')
			};
			let filters = { q: '', region: '', status: '' };
			let sort = { key: 'id', dir: 1 };

			/* ---------- Lig şeridi ---------- */
			function renderStrip() {
				const active = teams.filter((t) => t.status === 'active');
				const stadiums = new Map(active.map((t) => [t.stadium, t.capacity]));  // ortak stadyumlar bir kez sayılır
				const capacity = Array.from(stadiums.values()).reduce((s, c) => s + c, 0);
				const cities = new Set(active.map((t) => t.city)).size;
				const oldest = active.slice().sort((a, b) => a.founded - b.founded)[0];
				els.strip.innerHTML = `
			  <div class="strip-item strip-item--green"><span class="strip-icon">${icon('shield')}</span><div><span class="strip-label">Aktif takım</span><span class="strip-value">${active.length} <small>/ ${MAX_ACTIVE}</small></span></div></div>
			  <div class="strip-item strip-item--blue"><span class="strip-icon">${icon('pin')}</span><div><span class="strip-label">Temsil edilen şehir</span><span class="strip-value">${cities}</span></div></div>
			  <div class="strip-item strip-item--navy"><span class="strip-icon">${icon('stadium')}</span><div><span class="strip-label">Toplam stadyum kapasitesi</span><span class="strip-value">${num(capacity)}</span></div></div>
			  <div class="strip-item strip-item--red"><span class="strip-icon">${icon('clock')}</span><div><span class="strip-label">En köklü kulüp</span><span class="strip-value">${oldest ? `${esc(oldest.name)} <small>${oldest.founded}</small>` : '-'}</span></div></div>`;
			}

			/* ---------- Tablo ---------- */
			function visibleTeams() {
				const q = norm(filters.q.trim());
				return teams
					.filter((t) =>
						(!q || [t.name, t.city, t.stadium, t.code].some((v) => norm(v).includes(q))) &&
						(!filters.region || t.region === filters.region) &&
						(!filters.status || t.status === filters.status))
					.sort((a, b) => {
						const x = a[sort.key], y = b[sort.key];
						return (typeof x === 'string' ? x.localeCompare(y, 'tr') : x - y) * sort.dir;
					});
			}

			function renderTable(highlightId) {
				const list = visibleTeams();
				if (!list.length) {
					els.rows.innerHTML = `<tr class="table-empty"><td colspan="9"><strong>Takım bulunamadı</strong>Filtreleri değiştirin ya da Temizle ile tüm takımları gösterin.</td></tr>`;
				} else {
					els.rows.innerHTML = list.map((t) => `
				<tr data-id="${t.id}" class="${t.status === 'inactive' ? 'is-inactive' : ''}${t.id === highlightId ? ' is-new' : ''}">
				  <td class="col-id">${t.id}</td>
				  <td>
					<div class="team-cell">
					  <span class="team-crest" style="${crestStyle(t.colorA, t.colorB)}" aria-hidden="true">${esc(t.code)}</span>
					  <div><span class="team-name">${esc(t.name)}</span><span class="team-code">${esc(t.code)}</span></div>
					</div>
				  </td>
				  <td class="city-cell">${esc(t.city)}<small><span class="region region--${t.region}">${REGION[t.region]}</span></small></td>
				  <td>${esc(t.stadium)}</td>
				  <td class="col-num">${num(t.capacity)}</td>
				  <td class="col-num">${t.founded}</td>
				  <td><span class="swatches" title="${t.colorA} / ${t.colorB}"><span class="swatch" style="--c:${t.colorA}"></span><span class="swatch" style="--c:${t.colorB}"></span></span></td>
				  <td><span class="badge-a badge-a--${t.status}">${t.status === 'active' ? 'Aktif' : 'Pasif'}</span></td>
				  <td class="col-actions">
					<div class="row-actions">
					  <a class="act-btn" href="/Admin/Teams/Detail/${t.id}" data-demo-nav title="Detay" aria-label="Detay: ${esc(t.name)}">${icon('eye')}</a>
					  <button type="button" class="act-btn" data-edit="${t.id}" title="Düzenle" aria-label="Düzenle: ${esc(t.name)}">${icon('edit')}</button>
					  <button type="button" class="act-btn act-btn--danger" data-delete="${t.id}" title="Sil" aria-label="Sil: ${esc(t.name)}">${icon('trash')}</button>
					</div>
				  </td>
				</tr>`).join('');
				}
				els.count.textContent = `${teams.length} takımdan ${list.length} tanesi gösteriliyor`;
				document.querySelectorAll('[data-sort-col]').forEach((th) =>
					th.setAttribute('aria-sort', th.dataset.sortCol === sort.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'));
			}
			function renderAll(highlightId) { renderStrip(); renderTable(highlightId); }

			/* Filtre + sıralama */
			els.filter.addEventListener('submit', (e) => {
				e.preventDefault();
				const fd = new FormData(els.filter);
				filters = { q: fd.get('q') || '', region: fd.get('region') || '', status: fd.get('status') || '' };
				renderTable();
			});
			$('[data-filter-reset]').addEventListener('click', () => {
				els.filter.reset();
				filters = { q: '', region: '', status: '' };
				renderTable();
			});
			document.querySelectorAll('[data-sort]').forEach((btn) => btn.addEventListener('click', () => {
				const key = btn.dataset.sort;
				sort = sort.key === key ? { key, dir: -sort.dir } : { key, dir: 1 };
				renderTable();
			}));

			/* ---------- Form ---------- */
			const f = els.form.elements;
			const preview = {
				crest: $('[data-preview-crest]'),
				name: $('[data-preview-name]'),
				meta: $('[data-preview-meta]'),
				colorA: $('[data-color-a]'),
				colorB: $('[data-color-b]'),
				statusHint: $('[data-status-hint]')
			};

			function updatePreview() {
				const a = f.colorA.value.toUpperCase(), b = f.colorB.value.toUpperCase();
				preview.crest.setAttribute('style', crestStyle(a, b));
				preview.crest.textContent = (f.code.value || '---').toUpperCase();
				preview.name.textContent = f.name.value.trim() || 'Takım adı';
				const meta = [f.city.value.trim(), f.stadium.value.trim()].filter(Boolean).join(', ');
				preview.meta.textContent = meta || 'Şehir, stadyum';
				preview.colorA.textContent = a;
				preview.colorB.textContent = b;
			}
			function updateStatusHint() {
				const editingActive = f.id.value && teams.find((t) => t.id === Number(f.id.value))?.status === 'active';
				const used = activeCount() - (editingActive ? 1 : 0);
				preview.statusHint.textContent = `Ligde şu anda ${activeCount()} aktif takım var (sınır ${MAX_ACTIVE}).` +
					(used >= MAX_ACTIVE ? ' Yeni aktif takım için önce bir takımı pasif yapın.' : '');
			}

			f.code.addEventListener('input', () => { f.code.value = f.code.value.toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ]/g, ''); });
			['name', 'code', 'city', 'stadium', 'colorA', 'colorB'].forEach((n) => f[n].addEventListener('input', updatePreview));
			['name', 'code', 'city', 'region', 'stadium', 'capacity', 'founded', 'status'].forEach((n) =>
				f[n].addEventListener('input', () => clearError(n)));
			['colorA', 'colorB'].forEach((n) => f[n].addEventListener('input', () => clearError('colors')));

			function setError(name, msg) {
				const field = els.form.querySelector(`[data-field="${name}"]`);
				field.classList.add('has-error');
				field.querySelector('.field-error').textContent = msg;
				const input = f[name] || field.querySelector('input');
				if (input && input.setAttribute) input.setAttribute('aria-invalid', 'true');
			}
			function clearError(name) {
				const field = els.form.querySelector(`[data-field="${name}"]`);
				if (!field) return;
				field.classList.remove('has-error');
				field.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
			}
			function clearAllErrors() {
				els.form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
				els.form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
				els.alert.classList.remove('is-visible');
			}

			function validate(d) {
				const errors = [];
				const selfId = Number(d.id) || null;
				const others = teams.filter((t) => t.id !== selfId);
				const name = d.name.trim();
				const code = d.code.trim().toUpperCase();

				if (!name) errors.push(['name', 'Lütfen takım adını girin.']);
				else if (name.length < 2) errors.push(['name', 'Takım adı en az 2 karakter olmalı.']);
				else if (others.some((t) => norm(t.name) === norm(name))) errors.push(['name', 'Bu isimde bir takım zaten kayıtlı.']);

				if (!code) errors.push(['code', 'Lütfen 3 harfli kısa adı girin.']);
				else if (code.length !== 3) errors.push(['code', 'Kısa ad tam olarak 3 harften oluşmalı.']);
				else if (others.some((t) => t.code === code)) errors.push(['code', 'Bu kısa ad başka bir takım tarafından kullanılıyor.']);

				if (!d.city.trim()) errors.push(['city', 'Lütfen şehir girin.']);
				if (!d.region) errors.push(['region', 'Lütfen bölge seçin.']);
				if (!d.stadium.trim()) errors.push(['stadium', 'Lütfen stadyum adını girin.']);

				const cap = Number(d.capacity);
				if (d.capacity === '') errors.push(['capacity', 'Lütfen stadyum kapasitesini girin.']);
				else if (!Number.isInteger(cap) || cap < 1000 || cap > 100000) errors.push(['capacity', 'Kapasite 1.000 ile 100.000 arasında olmalı.']);

				const year = Number(d.founded);
				if (d.founded === '') errors.push(['founded', 'Lütfen kuruluş yılını girin.']);
				else if (!Number.isInteger(year) || year < 1850 || year > 2026) errors.push(['founded', 'Kuruluş yılı 1850 ile 2026 arasında olmalı.']);

				if (d.colorA.toUpperCase() === d.colorB.toUpperCase()) errors.push(['colors', 'Ana renk ve ikinci renk aynı olamaz.']);

				if (d.status === 'active') {
					const wasActive = selfId && teams.find((t) => t.id === selfId)?.status === 'active';
					if (!wasActive && activeCount() >= MAX_ACTIVE)
						errors.push(['status', `Serie A'da en fazla ${MAX_ACTIVE} aktif takım olabilir. Önce başka bir takımı pasif yapın.`]);
				}
				return errors;
			}

			/* ---------- Modal aç / kapat ---------- */
			let lastFocus = null;
			function openModal(team) {
				lastFocus = document.activeElement;
				els.form.reset();
				clearAllErrors();
				f.id.value = '';
				if (team) {
					els.title.textContent = 'Takımı Düzenle';
					['id', 'name', 'code', 'city', 'region', 'stadium', 'capacity', 'founded', 'status'].forEach((k) => { f[k].value = team[k]; });
					f.colorA.value = team.colorA;
					f.colorB.value = team.colorB;
				} else {
					els.title.textContent = 'Yeni Takım Ekle';
					f.status.value = activeCount() >= MAX_ACTIVE ? 'inactive' : 'active';
				}
				updatePreview();
				updateStatusHint();
				els.modal.showModal();
				f.name.focus();
			}
			const closeModal = () => els.modal.close();
			els.modal.addEventListener('close', () => { if (lastFocus) lastFocus.focus(); });
			els.modal.addEventListener('click', (e) => { if (e.target === els.modal) closeModal(); });
			document.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', closeModal));
			$('[data-open-create]').addEventListener('click', () => openModal(null));

			/* ---------- Kaydet ---------- */
			els.form.addEventListener('submit', (e) => {
				e.preventDefault();
				clearAllErrors();
				const d = Object.fromEntries(new FormData(els.form).entries());
				const errors = validate(d);
				if (errors.length) {
					errors.forEach(([n, msg]) => setError(n, msg));
					els.alert.classList.add('is-visible');
					const first = f[errors[0][0]] || f.colorA;
					first.focus();
					return;
				}
				const record = {
					name: d.name.trim(),
					code: d.code.trim().toUpperCase(),
					city: d.city.trim(),
					region: d.region,
					stadium: d.stadium.trim(),
					capacity: Number(d.capacity),
					founded: Number(d.founded),
					colorA: d.colorA.toUpperCase(),
					colorB: d.colorB.toUpperCase(),
					status: d.status
				};
				let savedId;
				if (d.id) {
					// API: PUT /api/admin/teams/{id}
					savedId = Number(d.id);
					teams = teams.map((t) => (t.id === savedId ? { ...t, ...record } : t));
					toast('Takım başarıyla güncellendi.');
				} else {
					// API: POST /api/admin/teams
					savedId = Math.max(0, ...teams.map((t) => t.id)) + 1;
					teams.push({ id: savedId, ...record });
					toast('Takım başarıyla eklendi.');
				}
				closeModal();
				renderAll(savedId);
				const row = els.rows.querySelector(`[data-id="${savedId}"]`);
				if (row) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				else toast('Kayıt mevcut filtreler nedeniyle gizli.', 'info');
			});

			/* ---------- Düzenle / Sil ---------- */
			let pendingDelete = null;
			els.rows.addEventListener('click', (e) => {
				const edit = e.target.closest('[data-edit]');
				const del = e.target.closest('[data-delete]');
				if (edit) openModal(teams.find((t) => t.id === Number(edit.dataset.edit)));
				if (del) {
					const t = teams.find((x) => x.id === Number(del.dataset.delete));
					pendingDelete = t.id;
					const warn = t.status === 'active'
						? ' Takım şu anda Serie A\'da aktif; silinirse fikstür ve puan durumundaki kayıtları da etkilenir.'
						: '';
					els.delText.innerHTML = `<strong>${esc(t.name)}</strong> (${esc(t.code)}) kalıcı olarak silinecek.${warn} Bu işlem geri alınamaz.`;
					els.del.returnValue = '';
					els.del.showModal();
				}
			});
			els.del.addEventListener('close', () => {
				if (els.del.returnValue === 'confirm' && pendingDelete !== null) {
					// API: DELETE /api/admin/teams/{id}
					teams = teams.filter((t) => t.id !== pendingDelete);
					renderAll();
					toast('Takım silindi.');
				}
				pendingDelete = null;
			});

			/* ---------- Toast ---------- */
			function toast(message, type = 'success') {
				const el = document.createElement('div');
				el.className = `toast-a toast-a--${type}`;
				el.setAttribute('role', 'status');
				el.innerHTML = `${icon(type === 'success' ? 'check' : 'info')}<span>${esc(message)}</span>`;
				els.toasts.appendChild(el);
				setTimeout(() => el.remove(), 3500);
			}

			renderAll();
		})();
