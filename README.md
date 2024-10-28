# Mais Consulta

Sistema para gerenciamento de agenda para um psicólogo.

## Requisitos

- Python3+
- Flask
- Peewee ORM
- Angular

## Rodar API

1. **Crie e ative o ambiente virtual**:

    ```shell
    python3 -m venv venv
    source venv/bin/activate
    ```

2. **Instale as dependências**:

    ```shell
    pip install -r requirements.txt
    ```

3. **Entre na pasta da API e inicie o servidor**:

    ```shell
    cd api/
    python app.py
    ```

## Rodar Front-End

1. **Instale o Angular CLI** (caso não tenha instalado):

    ```shell
    npm install -g @angular/cli
    ```

2. **Navegue até o diretório do front-end do projeto**:

    ```shell
    cd agenda-psicologo-frontend/
    ```

3. **Instale as dependências do projeto**:

    ```shell
    npm install
    ```

4. **Inicie o servidor de desenvolvimento Angular**:

    ```shell
    ng serve
    ```

5. **Acesse o front-end** no seu navegador em:

    ```
    http://localhost:4200
    ```